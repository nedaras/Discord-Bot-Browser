export default function useAuth() {

    console.log(process.browser)
    if (process.browser) console.log(document)
    

    return 'no user'

}

// ! basic login to login orcheck is we are already logged in
// ! and we need to error handle is the token is incorect

// async function login() {

//     const token = cookie.get('token')
    
//     console.log()

//     if (token) {

//         if (await isLoggedIn()) await signOut(auth)
//         signInWithCustomToken(auth, token).then((user) =>{
//             console.log(user)
            

//         })
//         cookie.remove('token')

//     }

// }
// ! this i gey
// async function isLoggedIn() {
    
//     try {

//         await new Promise((resolve, reject) => {

//             onAuthStateChanged(auth, (user) => {

//                 if (user) resolve(user)
//                 else reject('no user!')

//             })

//         })

//         return true

//     } catch {

//         return false

//     }

// }

// useEffect(() => {

//     login()

// }, [])