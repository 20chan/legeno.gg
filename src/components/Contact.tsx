import Link from "next/link";

const url = 'https://discord.com/invite/vxMRjrtURT';

export const Contact = () => {
  return (
    <div className="text-center text-sm text-half-white/70">
      <div>
        <span className="text-half-red/70">207</span> 제작
      </div>
      <Link href={url} className="text-half-yellow/70 hover:text-half-white/70 hover:bg-half-yellow/70">
        문의하기 (디스코드)
      </Link>
    </div>
  )
}