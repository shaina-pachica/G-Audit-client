export default async function loginUser(username: string, password: string){
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            password: password
        }),
        credentials: "include",
    })
    
    if(!res.ok){
        throw new Error("Login failed")
    }

    return await res.json()
}