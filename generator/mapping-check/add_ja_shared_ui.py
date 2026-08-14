"""Add the Japanese shared UI strings omitted from the home audit DB."""

import sqlite3
from datetime import datetime, timezone
from pathlib import Path

DB = Path(__file__).with_name("mapping_audit_home.db")

VALUES = {
    "body.blogPage.eyebrow": "学習リソース",
    "body.blogPage.h1": "保護者と教師のための点つなぎアイデア",
    "body.blogPage.description": "活動選び、幼児期の学習力育成、家庭や教室での印刷用ワークシート活用に役立つ実践ガイドです。",
    "body.blogPage.breadcrumb": "ブログ",
    "body.blogPage.latestEyebrow": "最新記事",
    "body.blogPage.latestH2": "今日から使える役立つアイデア",
    "body.blogPage.readArticle": "記事を読む",
    "body.blogPage.by": "執筆:",
    "body.blogPage.backToAll": "← すべての記事に戻る",
    "body.blogPage.savePinterest": "Pinterestに保存",
    "body.blogPage.relatedEyebrow": "無料プリント",
    "body.blogPage.relatedHeading": "次はこちらの点つなぎコレクションをお試しください",
    "body.canadaPage.category": "カナダ",
    "body.circusPage.category": "サーカス",
    "body.cutePage.category": "かわいいパズル",
    "body.dinosaursPage.category": "恐竜",
    "body.flowersPage.category": "花",
    "body.gardenPage.category": "庭",
    "body.oceanPage.category": "海",
    "body.playgroundsPage.category": "遊び場",
    "body.spacePage.category": "宇宙",
    "body.uaePage.category": "アラブ首長国連邦",
    "body.usa250Page.category": "アメリカ建国250周年",
    "body.puzzleDetail.agesLabel": "対象年齢:",
    "body.puzzleDetail.dotsLabel": "点の数:",
    "body.puzzleDetail.freeLabel": "完全無料",
    "body.puzzleDetail.difficultyHeading": "難易度",
    "body.puzzleDetail.difficultyEasy": "簡単",
    "body.puzzleDetail.difficultyMedium": "中級",
    "body.puzzleDetail.difficultyHard": "難しい",
    "body.puzzleDetail.funFactPrefix": "豆知識:",
    "body.puzzleDetail.funFactLabel": "豆知識！",
    "body.puzzleDetail.noSignUp": "登録不要。PDFで開きます。USレター（8.5×11インチ）またはA4用紙に印刷できます。家庭や教室で無料で利用できます。",
    "body.puzzleDetail.comingSoon": "無料PDFをダウンロード — 近日公開",
    "body.puzzleDetail.youMightLike": "こちらもおすすめ",
    "body.downloadButton.label": "無料の印刷用PDFをダウンロード",
    "body.downloadButton.usage": "家庭や教室で無料で利用できます。",
    "body.downloadButton.paperNote": "{size}用紙向けサイズです。",
    "body.downloadButton.paperLetter": "USレター",
    "body.downloadButton.paperA4": "A4",
    "body.downloadButton.alternateLink": "A4版をご希望ですか？こちらをダウンロード",
    "body.downloadButton.downloadSize": "ダウンロード（印刷サイズ: {size}）",
    "body.downloadBadge.downloaded": "ダウンロード回数",
    "body.downloadBadge.times": "回",
    "body.downloadBadge.greatChoice": "素敵なパズルを選びました！",
    "body.shareButtons.label": "共有",
    "body.shareButtons.copyLink": "リンクをコピー",
    "body.shareButtons.copied": "リンクをコピーしました！",
    "body.shareButtons.shareMe": "共有する",
}


def main():
    conn = sqlite3.connect(DB)
    now = datetime.now(timezone.utc).isoformat()
    for key, value in VALUES.items():
        row = conn.execute(
            "SELECT id FROM mapping_audit WHERE language='ja' AND puzzle_slug='home' AND new_key=?",
            (key,),
        ).fetchone()
        if row:
            conn.execute("UPDATE mapping_audit SET new_value=?, status='OK', notes=? WHERE id=?",
                         (value, "Japanese shared UI localization", row[0]))
        else:
            conn.execute(
                """INSERT INTO mapping_audit
                (puzzle_slug,language,where_used_in_page,legacy_key,Legacy_value_by_key,
                 new_key,new_value,status,relevant,usage_relevant,notes,created_at,i18nRequired)
                VALUES ('home','ja','shared Japanese UI','NEW_FIELD',NULL,?,?,'OK','YES','YES',?,?,1)""",
                (key, value, "Japanese shared UI localization", now),
            )
    conn.commit()
    print(f"Upserted {len(VALUES)} Japanese shared UI values")


if __name__ == "__main__":
    main()
