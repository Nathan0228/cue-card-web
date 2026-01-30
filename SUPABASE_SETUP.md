# Supabase 数据库设置指南

本指南将帮助您在 Supabase 中创建项目所需的数据表。

## 📋 需要创建的表

1. **profiles** - 用户公开资料（用于卡片上显示作者名、用户页）
2. **categories** - 存储用户创建的分类
3. **cue_cards** - 存储用户创建的卡片

## 🚀 创建步骤

### 方法一：使用 Supabase Dashboard（推荐）

1. **登录 Supabase Dashboard**
   - 访问 [https://app.supabase.com](https://app.supabase.com)
   - 选择您的项目

2. **打开 SQL Editor**
   - 在左侧边栏点击 "SQL Editor"
   - 点击 "New query" 创建新查询

3. **执行 SQL 脚本**
   - 打开项目根目录下的 `supabase-schema.sql` 文件
   - 复制全部内容
   - 粘贴到 SQL Editor 中
   - 点击 "Run" 或按 `Ctrl+Enter` 执行

4. **验证表是否创建成功**
   - 在左侧边栏点击 "Table Editor"
   - 您应该能看到 `profiles`、`categories` 和 `cue_cards` 三张表

#### 已有项目：仅补加「公开卡片分类可见」策略

若你之前已执行过 `supabase-schema.sql`，只需在 SQL Editor 中执行下面这一条策略，即可让广场中他人公开卡片显示分类名：

```sql
CREATE POLICY "Anyone can view categories used by public cards"
    ON categories FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM cue_cards c
            WHERE c.category_id = categories.id AND c.private = false
        )
    );
```

### 方法二：使用 Supabase CLI

如果您使用 Supabase CLI 进行本地开发：

```bash
# 在项目根目录执行
supabase db reset
# 或者直接执行 SQL 文件
psql -h localhost -p 54322 -U postgres -d postgres -f supabase-schema.sql
```

## 📊 表结构说明

### profiles 表

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | UUID | 主键，关联 auth.users |
| full_name | TEXT | 显示名称（在卡片、用户页展示） |
| avatar_url | TEXT | 头像 URL（可选） |
| updated_at | TIMESTAMP | 更新时间 |

**说明：** 用户在「个人资料」页保存后会自动写入/更新此表；未保存过的用户显示为「匿名用户」。

### categories 表

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | UUID | 主键，自动生成 |
| name | TEXT | 分类名称（必填） |
| user_id | UUID | 用户ID，关联 auth.users |
| created_at | TIMESTAMP | 创建时间，自动生成 |

**约束：**
- 同一用户不能有重复的分类名（UNIQUE(user_id, name)）

### cue_cards 表

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | UUID | 主键，自动生成 |
| question | TEXT | 问题（必填） |
| answer | TEXT | 答案（必填） |
| user_id | UUID | 用户ID，关联 auth.users |
| category_id | UUID | 分类ID，关联 categories（可选） |
| private | BOOLEAN | 是否私有，默认 true |
| created_at | TIMESTAMP | 创建时间，自动生成 |

## 🔒 Row Level Security (RLS) 策略

SQL 脚本已自动配置 RLS 策略：

### categories 表策略
- ✅ 用户只能查看、创建、更新、删除自己的分类

### cue_cards 表策略
- ✅ 用户可以查看、创建、更新、删除自己的所有卡片
- ✅ 所有用户（包括未登录）可以查看公开的卡片（private = false）

## 🔍 索引说明

为了提高查询性能，已创建以下索引：
- `idx_categories_user_id` - 按用户ID查询分类
- `idx_cue_cards_user_id` - 按用户ID查询卡片
- `idx_cue_cards_category_id` - 按分类ID查询卡片
- `idx_cue_cards_private` - 查询公开/私有卡片
- `idx_cue_cards_created_at` - 按创建时间排序

## ✅ 验证设置

执行 SQL 后，您可以通过以下方式验证：

1. **检查表是否存在**
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN ('categories', 'cue_cards');
   ```

2. **检查 RLS 是否启用**
   ```sql
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public' 
   AND tablename IN ('categories', 'cue_cards');
   ```

3. **检查策略是否存在**
   ```sql
   SELECT schemaname, tablename, policyname 
   FROM pg_policies 
   WHERE tablename IN ('categories', 'cue_cards');
   ```

## 🐛 常见问题

### 问题1：执行 SQL 时提示权限错误
**解决方案：** 确保您使用的是项目所有者账户，或者使用 Service Role Key（仅在开发环境）

### 问题2：RLS 策略导致查询失败
**解决方案：** 
- 检查用户是否已登录（`auth.uid()` 不为空）
- 检查策略是否正确创建
- 在 Supabase Dashboard 的 "Authentication" > "Policies" 中查看策略

### 问题3：外键约束错误
**解决方案：** 确保 `auth.users` 表存在（Supabase 会自动创建）

## 📝 注意事项

1. ⚠️ **生产环境**：在生产环境执行前，请先在测试环境验证
2. ⚠️ **数据备份**：如果表中已有数据，执行前请先备份
3. ⚠️ **用户认证**：确保 Supabase Authentication 已正确配置
4. ✅ **自动时间戳**：`created_at` 字段会自动设置为 UTC 时间

## 🔗 相关文档

- [Supabase 官方文档](https://supabase.com/docs)
- [Row Level Security 文档](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL 文档](https://www.postgresql.org/docs/)
