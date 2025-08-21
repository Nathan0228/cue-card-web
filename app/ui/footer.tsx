// app/ui/footer.tsx
export default function Footer() {
    return (
      <footer className="bg-white-100 border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* 链接区域 */}
          <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-8">
            <a
              href="/blogs/about"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              About Me
            </a>
            <a
              href="/blogs/contact"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Contact
            </a>
            <a
              href="/blogs/privacy"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Privacy Policy
            </a>
            {/* <a
              href="/terms"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Terms of Service
            </a> */}
          </div>
  
          {/* 版权区域 */}
          <div className="mt-6 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} Cue Card Project. All rights reserved.
          </div>
        </div>
      </footer>
    );
  }
  