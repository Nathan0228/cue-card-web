// app/contact/page.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/app/ui/button";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const res = await fetch("/api/contant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
  
      if (!res.ok) throw new Error("发送失败");
  
      setSuccess(true);
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      alert("❌ 发送失败，请稍后再试");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-white-50 flex flex-col items-center px-6 py-12">
      {/* 标题 */}
      <header className="max-w-2xl text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Contact Me</h1>
        <p className="text-gray-600">
          有问题或者合作机会？欢迎填写表单联系我。
        </p>
      </header>

      {/* 表单区 */}
      <main className="w-full max-w-2xl bg-white shadow-md rounded-2xl p-8">
        {success ? (
          <div className="text-center text-green-600 font-medium">
            ✅ 已成功发送消息，我会尽快回复你！
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                姓名
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="输入你的称呼"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                邮箱
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="请输入正确的邮箱地址"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                留言
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={5}
                placeholder="请输入你的留言内容，想法或者其他反馈。我会尽快回复你。"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full  text-white font-medium py-2 rounded-lg  transition disabled:opacity-50"
            >
              {loading ? "发送中..." : "发送消息"}
            </Button>
          </form>
        )}
      </main>
    </div>
  );
}
