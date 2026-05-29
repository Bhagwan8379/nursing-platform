import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import z from "zod"
import { useNavigate, Link } from "react-router-dom"
import { useLoginAdminMutation } from "@/redux/apis/authApi"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock, Shield, ArrowRight } from "lucide-react"
import { toast } from "sonner"

const AdminLogin = () => {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [adminLogin, { isLoading }] = useLoginAdminMutation()

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
            await adminLogin(loginData).unwrap()
            toast.success('Admin access granted! Welcome back.')
            navigate('/admin/dashboard')
        } catch (error) {
            toast.error(error?.data?.message || 'Invalid admin credentials')
            console.error('Login failed:', error)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-purple-950 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="max-w-md w-full shadow-2xl border-0 bg-slate-900/60 backdrop-blur-md text-white relative z-10 border-purple-500/20">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-linear-to-br from-purple-500 to-pink-500 p-3 rounded-2xl shadow-lg">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-bold tracking-tight text-white">Admin Portal</CardTitle>
                    <CardDescription className="text-slate-400 text-sm">
                        Secure access to CareNest central desk operations
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-semibold text-slate-300">
                                Admin Email
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@carenest.com"
                                    className="pl-10 bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus-visible:ring-purple-500"
                                    {...register('email')}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-xs text-red-400">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-semibold text-slate-300">
                                Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    className="pl-10 pr-10 bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus-visible:ring-purple-500"
                                    {...register('password')}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-xs text-red-400">{errors.password.message}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 font-bold"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Authenticating...
                                </div>
                            ) : (
                                <>
                                    Access Admin Panel
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex justify-center border-t border-slate-800/50 py-4">
                    <div className="text-center text-[10px] text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                        <Shield className="w-3 h-3 text-red-500" />
                        Authorized personnel only
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}

export default AdminLogin