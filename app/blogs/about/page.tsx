'use client'
import React from "react";
import { useState } from "react";
import Image from 'next/image'

export default function AboutPage() {
    const [showModal, setShowModal] = useState(false);
  return (
    <div className="min-h-screen bg-white-50 flex flex-col items-center justify-start px-6 py-12">
      {/* 标题区 */}
      <header className="max-w-3xl text-left">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
          关于我和Cue Card
        </h1>
        <p className="text-sm text-gray-400 text-right">时间：2025.8.21</p>
        <p className="text-lg text-gray-600">
          在考研的复习中，我有了关于Cue Card的一些想法，因此我想实现它，不管结果怎么样，我希望是有帮助的。
        </p>
      </header>

      {/* 内容区 */}
      <main className="mt-10 max-w-3xl w-full space-y-12">
        {/* About Section */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            👋 自我介绍
          </h2>
          <p className="text-gray-700 leading-relaxed">
            2025年九月份后就是大四学生了，喜欢独立站设计与开发，但能力有限。
            软件工程专业，某双非院校在读，目前正在复习考研。
            <br />
            兴趣是成长中最好的老师，不会就查，借助AI。
          </p>
        </section>

        {/* Skills Section */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">🧰 技能栈</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>前端：React / Next.js / Tailwind CSS</li>
            <li>后端：Node.js / Supabase</li>
            <li>数据库：PostgreSQL </li>
            <li>工具：Git/Supabse Auth/Resend Email</li>
          </ul>
        </section>

        {/* 想法 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">🤔 想法和实现</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>建立网站大致框架，包括用户登录注册以及个人信息修改。</li>
            <li>添加设置，内置字体，用户可以更改网站字体样式。</li>
            <li>添加Cue Card.只有登录用户可以添加卡片，而且添加分类时，基于自己之前添加的分类以供选择
                ，还可以自定义分类。 </li>
            <li>主页面可以显示用户添加的卡片，<span className="line-through">可以按照分类进行筛选。</span></li>
            
          </ul>
        </section>

        {/* 卡片设计 */}
        <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">🎨 卡片设计</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>翻转卡片，正面显示Question, 背面显示Answer。</li>
                <li>卡片显示标签、是否公开、发布者以及反转提示。</li>
                <li className="line-through">点击标签查看改标签下的卡片。</li>
                <li className="line-through">卡片可以编辑、删除。</li>
                <li className="line-through">卡片可以导出。</li>
            </ul>
        </section>

        {/* Contact Section */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">📬 联系方式</h2>
          <p className="text-gray-700 mb-4">
            如果你想联系我，可以通过以下方式：
          </p>
          <div className="space-y-2">
            <p>
              📧 Email:{" "}
              <a
                href="mailto:chenmoliang2022@outlook.com"
                className="text-blue-600 hover:underline"
              >
                chenmoliang2022@outlook.com
              </a>
            </p>
            <p>
              💻 GitHub:{" "}
              <a
                href="https://github.com/Nathan0228/cue-card-web"
                target="_blank"
                className="text-blue-600 hover:underline"
              >
                github.com/Nathan0228/cue-card-web
              </a>
            </p>
            <p>
              📝 Blog:{" "}
              <a
                href="https://w.waterman.ip-ddns.com"
                className="text-blue-600 hover:underline"
              >
                我的博客Waterman
              </a>
            </p>
          </div>
        </section>

        {/* Buy Me A Coffee Section */}
        <section>
            <h2 
            onClick={() => setShowModal(!showModal)}
            className="text-2xl font-semibold text-gray-800 mb-3">🥤 Buy Me A Coffee</h2>
            
            {showModal && (
                <Image
                src='/buy-me-a-coffee.jpg'
                width={500}
                height={500}
                alt = 'Buy Me A Coffee'
                className="mx-auto mt-4 max-w-sm rounded-xl shadow-lg" 
                />
                )}
        </section>

{/* 2025.8.25更新 */}
        <section>
            <h2
            onClick={() => setShowModal(!showModal)}
            className="text-lg font-bold text-green-800 mb-3">  2025.8.25更新
            </h2>
            {showModal && (
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                <li>添加卡片时可以选择私有或公开。</li>
                <li>卡片可以放大查看，电脑端按Esc可以关闭，移动端向下滑切换下一个。</li>
                <li>主页显示我的卡片，且可以进行卡片切换。</li>
                <li>头部固定，更加符合现代化设计。</li>
                <li>个性化标签设计，可以自定义标签。</li>
                <li>广场展示自己的公开卡片，可按标签进行查看。</li>
                
                 </ul>
               
                )}
            
        </section>

      </main>
    </div>
  );
}
