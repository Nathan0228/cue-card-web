export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white-50 flex flex-col items-center justify-start px-6 py-12">
          {/* 标题区 */}
          <header className="max-w-3xl text-left">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
            隐私条例
            </h1>
            <p className="text-sm text-gray-400 text-right">时间：2025.8.21</p>
            <p className="text-lg text-gray-600">
              使用本网站，表示你已同意。
            </p>
          </header>
    
          {/* 内容区 */}
          <main className="mt-10 max-w-3xl w-full space-y-12">
            {/* About Section */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                登入注册
              </h2>
              <p className="text-gray-700 leading-relaxed">
              可使用Google、Github等第三方进行注册登录，将收集你的邮箱、头像、用户名等信息，不会存储你的密码等隐私
              信息。。
              </p>
              <p className="text-gray-700 leading-relaxed">
              使用邮箱注册，请检查邮箱的验证信息，点击链接即可进行验证。
              </p>
              ······
            </section>

          </main>
        </div>
      );

}