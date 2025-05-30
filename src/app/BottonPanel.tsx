'use client'

import { motion } from 'framer-motion'


export default function BottonPanel() {
    return (
        
            <div className=" fixed bottom-0 left-0 z-50 w-full h-16 border-t border-yellow-500/20 md:hidden bg-black/50 backdrop-blur-lg">
                <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium sm:grid-cols-5">
                    <a className="inline-flex flex-col items-center justify-center px-5 hover:bg-black group" href="/">
                        <svg className="w-4 h-4 mb-1 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                        </svg><span className="text-xs text-white">Inicio</span></a><a className="inline-flex flex-col items-center justify-center px-5 hover:bg-black group" href="/logros">
                        <svg className="w-4 h-4 mb-1 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M8 21l8 0">
                        </path><path d="M12 17l0 4"></path><path d="M7 4l10 0"></path><path d="M17 4v8a5 5 0 0 1 -10 0v-8"></path>
                            <path d="M5 9m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path><path d="M19 9m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0">
                            </path></svg>
                        <span className="text-xs text-white">Logros</span>
                    </a>
                    <a className="inline-flex flex-col items-center justify-center px-5 hover:bg-black group" href="/">
                        <svg className="w-4 h-4 mb-1 text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none">
                        </path><path d="M9 9v-1a3 3 0 0 1 6 0v1">
                            </path>
                            <path d="M8 9h8a6 6 0 0 1 1 3v3a5 5 0 0 1 -10 0v-3a6 6 0 0 1 1 -3"></path>
                            <path d="M3 13l4 0"></path><path d="M17 13l4 0"></path><path d="M12 20l0 -6">
                            </path><path d="M4 19l3.35 -2"></path><path d="M20 19l-3.35 -2"></path>
                            <path d="M4 7l3.75 2.4"></path><path d="M20 7l-3.75 2.4"></path></svg>
                        <span className="text-xs text-white">Reportar</span>
                    </a>
                    <a target="_blank" rel="nofollow noopener noreferrer" href="/" className="inline-flex flex-col items-center justify-center px-5 hover:bg-black group">
                        <svg className="w-4 h-4 mb-1 text-gray-500 transition-all "
                            viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="#FFFFFF">
                            </path></svg>
                        <span className="text-xs text-white">Compartir</span>
                    </a>
                    <a target="_blank" rel="nofollow noopener noreferrer" href="/"
                        className="flex-col items-center justify-center hidden px-5 sm:inline-flex hover:bg-black group">
                        <svg className="w-4 h-4 mb-1 text-gray-500 transition-all"
                            xmlns="http://www.w3.org/2000/svg"
                            width="800"
                            height="800"
                            preserveAspectRatio="xMidYMid"
                            viewBox="0 -28.5 256 256">
                            <path
                                fill="#5865F2" d="M216.856339 16.5966031C200.285002 8.84328665 182.566144 3.2084988 164.041564 0c-2.275041 4.11318106-4.93294 9.64549908-6.765465 14.0464379-19.692104-2.9614483-39.203132-2.9614483-58.5330827 0C96.9108417 9.64549908 94.1925838 4.11318106 91.8971895 0 73.3526068 3.2084988 55.6133949 8.86399117 39.0420583 16.6376612 5.61752293 67.146514-3.4433191 116.400813 1.08711069 164.955721c22.16890891 16.555194 43.65325271 26.611976 64.77502181 33.192855 5.2150826-7.17745 9.8662303-14.807241 13.8730814-22.848315-7.6311949-2.899686-14.9402415-6.478059-21.8464273-10.632298 1.8321746-1.357374 3.6243438-2.776511 5.3558032-4.236706 42.1228202 19.70193 87.8903382 19.70193 129.5099332 0 1.751813 1.460195 3.543631 2.879332 5.355803 4.236706-6.926539 4.174593-14.255589 7.752966-21.886784 10.653002 4.006851 8.02037 8.637996 15.670866 13.873082 22.847965 21.142122-6.580879 42.646399-16.637311 64.815325-33.213209 5.315798-56.28752-9.080862-105.0894778-38.05561-148.3591179ZM85.4738752 135.09489c-12.6448471 0-23.0146535-11.804735-23.0146535-26.179989 0-14.3752538 10.1483733-26.2003423 23.0146535-26.2003423 12.8666312 0 23.2360868 11.804384 23.0146538 26.2003423.020002 14.375254-10.1480226 26.179989-23.0146538 26.179989Zm85.0513618 0c-12.644847 0-23.014653-11.804735-23.014653-26.179989 0-14.3752538 10.148022-26.2003423 23.014653-26.2003423 12.866281 0 23.236087 11.804384 23.014654 26.2003423 0 14.375254-10.148373 26.179989-23.014654 26.179989Z"></path>
                        </svg>
                        <span className="text-sm text-white">Comunidad</span></a></div>
            </div>
       

    )
}