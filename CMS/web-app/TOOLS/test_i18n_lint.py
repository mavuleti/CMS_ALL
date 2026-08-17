"""Small regression suite for the JSX candidate and filtering behavior."""

from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

import i18n_lint


class I18nLintTests(unittest.TestCase):
    def inspect(self, body: str, suffix: str = ".tsx") -> list[i18n_lint.Violation]:
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / f"Example{suffix}"
            path.write_text(body, encoding="utf-8")
            violations, parse_error = i18n_lint.inspect_file(
                path, min_words=2, patterns=[], functions={"t", "i18n.t", "formatMessage"}
            )
            self.assertFalse(parse_error)
            return violations

    def test_finds_jsx_text_attributes_and_static_expressions(self) -> None:
        violations = self.inspect(
            """export const Page = () => (
  <main title="Welcome home">
    <button>Save changes</button>
    <input aria-label={'Search puzzles'} placeholder={"Type keywords"} />
    {`Printable activity`}
  </main>
);"""
        )
        self.assertEqual(
            [item.text for item in violations],
            ["Welcome home", "Save changes", "Search puzzles", "Type keywords", "Printable activity"],
        )

    def test_ignores_translations_dynamic_values_and_non_language(self) -> None:
        violations = self.inspect(
            """export const Page = ({name}) => (
  <main title={t('page.title')}>
    <span>{i18n.t('hello')}</span>
    <span>{name}</span><span>7</span><img alt="A" src="https://example.com/a.png" />
  </main>
);"""
        )
        self.assertEqual(violations, [])

    def test_ignored_pattern_and_minimum_words(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "Example.jsx"
            path.write_text("const x = <><p>Coming soon now</p><p>Two words</p></>;", encoding="utf-8")
            violations, _ = i18n_lint.inspect_file(
                path,
                min_words=3,
                patterns=[i18n_lint.re.compile(r"^Coming")],
                functions={"t"},
            )
            self.assertEqual(violations, [])

    def test_project_patterns_ignore_email_and_exact_site_name(self) -> None:
        patterns = [
            i18n_lint.re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$"),
            i18n_lint.re.compile(r"^DotToDotFreePrintables(?:\.com)?$"),
        ]
        self.assertTrue(i18n_lint.should_ignore("you@example.com", 2, patterns))
        self.assertTrue(i18n_lint.should_ignore("DotToDotFreePrintables.com", 2, patterns))
        self.assertFalse(i18n_lint.should_ignore("Visit DotToDotFreePrintables home", 2, patterns))

    def test_key_suggestion_uses_path_and_text(self) -> None:
        base = Path("src").resolve()
        key = i18n_lint.suggested_key(base / "pages" / "Home.tsx", "Save Changes!", base)
        self.assertEqual(key, "pages.home.save_changes")


if __name__ == "__main__":
    unittest.main()
