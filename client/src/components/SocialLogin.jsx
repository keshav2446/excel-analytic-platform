import { FaGoogle, FaGithub, FaTwitter, FaFacebook } from "react-icons/fa";

export default function SocialLogin() {
  const handleSocialClick = (provider) => {
   // alert(`Redirecting to ${provider} login...`);
    // Later: Replace with real backend redirect like:
    // window.location.href = `http://localhost:5000/api/auth/${provider}`
  };

  return (
    <div className="mt-6 text-center">
      <p className="text-white/80 text-sm mb-3">or continue with</p>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => handleSocialClick("google")}
          className="p-3 rounded-full border border-white/30 text-white hover:bg-white/10 transition"
          aria-label="Login with Google"
        >
          <FaGoogle size={20} />
        </button>
        <button
          onClick={() => handleSocialClick("github")}
          className="p-3 rounded-full border border-white/30 text-white hover:bg-white/10 transition"
          aria-label="Login with GitHub"
        >
          <FaGithub size={20} />
        </button>
        <button
          onClick={() => handleSocialClick("twitter")}
          className="p-3 rounded-full border border-white/30 text-white hover:bg-white/10 transition"
          aria-label="Login with Twitter"
        >
          <FaTwitter size={20} />
        </button>
        <button
          onClick={() => handleSocialClick("facebook")}
          className="p-3 rounded-full border border-white/30 text-white hover:bg-white/10 transition"
          aria-label="Login with Facebook"
        >
          <FaFacebook size={20} />
        </button>
      </div>
    </div>
  );
}
