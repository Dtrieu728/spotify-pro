import "./Signup.css";

const SignupForm=()=>{
    return(
        <div className="container">
            <form>
                <label>Email</label>
                <input type="email"></input>
                <label>Password</label>
                <input type="password"></input>
                <button type="submit">Sign Up</button>
           </form>
        </div>
    )
}
export default SignupForm;