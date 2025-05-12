Mosiac Frontend
Mosiac Frontend là ứng dụng React xây dựng với TypeScript và Vite, sử dụng các công nghệ hiện đại như Ant Design, Redux Toolkit, và i18next. Dự án được đóng gói bằng Docker để dễ dàng triển khai.
Yêu Cầu Hệ Thống

Node.js v18.x trở lên (khuyến nghị sử dụng Node.js 20.x)
Bun v1.x (để thay thế npm/yarn cho tốc độ nhanh hơn)
Docker và Docker Compose (nếu sử dụng phương pháp triển khai Docker)

Cài Đặt và Chạy Dự Án
Phương Pháp 1: Sử dụng Bun (Khuyến nghị cho Phát triển)

Cài đặt Bun

bash# MacOS, Linux, hoặc WSL
curl -fsSL https://bun.sh/install | bash

# Windows (thông qua PowerShell)
powershell -c "irm bun.sh/install.ps1 | iex"

Clone dự án

bashgit clone <repository-url>
cd mosiac-frontend

Cài đặt dependencies

bashbun install

Chạy môi trường phát triển

bashbun run dev
Ứng dụng sẽ chạy tại http://localhost:5173
