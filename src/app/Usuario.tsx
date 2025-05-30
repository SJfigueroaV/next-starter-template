"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import Image from "next/image";
import Avatar from "./avatar.jpg"
export default function UserProfile() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user);
        });
    }, []);

    if (!user) return null;

    const avatar = user.user_metadata?.avatar_url;
    const name = user.user_metadata?.full_name || user.email;
    console.log("Avatar URL:", avatar);

    return (

        <div className="relative flex items-center jSustify-center group">
            <img
                src={avatar}
                alt="Avatar del usuario"
                className="w-10 h-10 transition rounded-full"
                width={40}
                height={40}
            />
            <span className="pl-3 text-xl font-medium text-yellow-300">{name}</span>
        </div>

    );
}
