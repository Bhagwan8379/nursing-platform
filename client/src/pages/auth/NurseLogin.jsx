import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useNavigate, Link } from "react-router-dom"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock, Stethoscope, ArrowRight } from "lucide-react"
import { useLoginNurseMutation } from "@/redux/apis/authApi"
import { toast } from "sonner"

const NurseLogin = () => {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [nurseLogin, { isLoading }] = useLoginNurseMutation()

    const loginSchema = z.object({
        email: z.string().email("Please enter a valid email address").min(1, "Email is required"),
        password: z.string().min(6, "Password must be at least 6 characters")
    })

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const handleFormSubmit = async (loginData) => {
        try {
            await nurseLogin(loginData).unwrap()
            toast.success("Welcome back, CareNest Partner!")
            navigate("/nurse/dashboard")
        } catch (error) {
            toast.error(error?.data?.message || "Login failed. Please check your credentials.")
            console.error("Login failed:", error)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 via-white to-teal-50 py-12 px-4">
            <Card className="max-w-md w-full shadow-2xl border-0 bg-white/95 backdrop-blur-xs relative z-10">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-linear-to-br from-teal-500 to-emerald-500 p-3 rounded-2xl shadow-lg">
                            <Stethoscope className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-bold tracking-tight text-slate-800">Nurse Login</CardTitle>
                    <CardDescription className="text-slate-500 text-sm">
                        Access your dispatched care visits, schedules, and payouts
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-slate-700">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    type="email"
                                    placeholder="nurse@carenest.com"
                                    className="pl-10"
                                    {...register("email")}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-xs text-red-500">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-slate-700">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="pl-10 pr-10"
                                    {...register("password")}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-xs text-red-500">{errors.password.message}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-linear-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 font-bold h-11 shadow-md hover:shadow-lg transition-all"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2 justify-center">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Logging in...
                                </div>
                            ) : (
                                <>
                                    Login as CareNest Partner
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4 border-t border-slate-100 py-4">
                    <p className="text-sm text-slate-500">
                        Don't have a partner account?{" "}
                        <Link to="/nurse/register" className="text-teal-600 hover:underline font-bold">
                            Register as Nurse
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}

export default NurseLogin