-- 创建 submissions 表
CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id TEXT NOT NULL,
    text TEXT NOT NULL,
    emotion TEXT NOT NULL,
    created_at TEXT NOT NULL,
    INDEX idx_device_id (device_id),
    INDEX idx_emotion (emotion),
    INDEX idx_created_at (created_at)
);

-- 创建 reflections 表
CREATE TABLE IF NOT EXISTS reflections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    submission_id INTEGER NOT NULL,
    text TEXT NOT NULL,
    emotion TEXT NOT NULL,
    is_generated INTEGER DEFAULT 0,
    created_at TEXT NOT NULL,
    FOREIGN KEY (submission_id) REFERENCES submissions(id),
    INDEX idx_submission_id (submission_id),
    INDEX idx_emotion (emotion),
    INDEX idx_is_generated (is_generated),
    INDEX idx_created_at (created_at)
);

-- 创建 collections 表
CREATE TABLE IF NOT EXISTS collections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id TEXT NOT NULL,
    reflection_id INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (reflection_id) REFERENCES reflections(id),
    UNIQUE(device_id, reflection_id),
    INDEX idx_device_id (device_id),
    INDEX idx_reflection_id (reflection_id),
    INDEX idx_created_at (created_at)
);

-- 插入一些初始的共鸣数据
INSERT INTO reflections (submission_id, text, emotion, is_generated, created_at) VALUES
(1, '我理解你的难过，一切都会好起来的', 'sad', 1, datetime('now')),
(1, '悲伤的时候，记得给自己一个拥抱', 'sad', 1, datetime('now')),
(1, '你的感受是真实的，我在这里陪着你', 'sad', 1, datetime('now')),
(1, '孤独的时候，星星也在陪伴着你', 'lonely', 1, datetime('now')),
(1, '你并不孤单，我懂你的感受', 'lonely', 1, datetime('now')),
(1, '有时候孤独也是一种力量', 'lonely', 1, datetime('now')),
(1, '你的快乐感染了我，真好', 'happy', 1, datetime('now')),
(1, '保持这份美好，世界因你而明亮', 'happy', 1, datetime('now')),
(1, '快乐是最珍贵的礼物', 'happy', 1, datetime('now')),
(1, '迷茫是成长的必经之路', 'confused', 1, datetime('now')),
(1, '慢慢来，答案会自己出现的', 'confused', 1, datetime('now')),
(1, '困惑的时候，给自己一些时间', 'confused', 1, datetime('now')),
(1, '释然的感觉真好，你做得对', 'relieved', 1, datetime('now')),
(1, '放下负担，轻装前行', 'relieved', 1, datetime('now')),
(1, '内心的平静是最美的风景', 'relieved', 1, datetime('now')),
(1, '愤怒是正常的，但别让它伤害自己', 'angry', 1, datetime('now')),
(1, '深呼吸，让情绪慢慢平静', 'angry', 1, datetime('now')),
(1, '你的愤怒我理解，但请善待自己', 'angry', 1, datetime('now')),
(1, '想念是爱的另一种表达', 'missing', 1, datetime('now')),
(1, '那些美好的回忆永远在心里', 'missing', 1, datetime('now')),
(1, '思念让爱更加深刻', 'missing', 1, datetime('now')),
(1, '渴望是前进的动力', 'yearning', 1, datetime('now')),
(1, '你的梦想值得被追逐', 'yearning', 1, datetime('now')),
(1, '内心的渴望指引着方向', 'yearning', 1, datetime('now')); 