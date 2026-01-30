-- ============================================
-- CueCard Web 项目 Supabase 数据库表结构
-- ============================================

-- 0. 创建 profiles（用户公开资料）表，用于在卡片上显示作者名、用户页等
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 所有人可读（用于展示作者名、用户页）
CREATE POLICY "Profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

-- 仅本人可插入/更新
CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- 1. 创建 categories（分类）表
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, name) -- 同一用户不能有重复的分类名
);

-- 2. 创建 cue_cards（卡片）表
CREATE TABLE IF NOT EXISTS cue_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    private BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_cue_cards_user_id ON cue_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_cue_cards_category_id ON cue_cards(category_id);
CREATE INDEX IF NOT EXISTS idx_cue_cards_private ON cue_cards(private);
CREATE INDEX IF NOT EXISTS idx_cue_cards_created_at ON cue_cards(created_at DESC);

-- 4. 启用 Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE cue_cards ENABLE ROW LEVEL SECURITY;

-- 5. 创建 RLS 策略 - categories 表
-- 用户可以查看自己的分类
CREATE POLICY "Users can view their own categories"
    ON categories FOR SELECT
    USING (auth.uid() = user_id);

-- 所有人可查看「被某张公开卡片引用」的分类（用于在广场显示他人卡片的分类名）
CREATE POLICY "Anyone can view categories used by public cards"
    ON categories FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM cue_cards c
            WHERE c.category_id = categories.id AND c.private = false
        )
    );

-- 用户可以创建自己的分类
CREATE POLICY "Users can create their own categories"
    ON categories FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 用户可以更新自己的分类
CREATE POLICY "Users can update their own categories"
    ON categories FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 用户可以删除自己的分类
CREATE POLICY "Users can delete their own categories"
    ON categories FOR DELETE
    USING (auth.uid() = user_id);

-- 6. 创建 RLS 策略 - cue_cards 表
-- 用户可以查看自己的所有卡片
CREATE POLICY "Users can view their own cards"
    ON cue_cards FOR SELECT
    USING (auth.uid() = user_id);

-- 所有用户（包括未登录）可以查看公开的卡片
CREATE POLICY "Anyone can view public cards"
    ON cue_cards FOR SELECT
    USING (private = false);

-- 用户可以创建自己的卡片
CREATE POLICY "Users can create their own cards"
    ON cue_cards FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 用户可以更新自己的卡片
CREATE POLICY "Users can update their own cards"
    ON cue_cards FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 用户可以删除自己的卡片
CREATE POLICY "Users can delete their own cards"
    ON cue_cards FOR DELETE
    USING (auth.uid() = user_id);
