import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import z from "zod"
import { useNavigate, Link, useLocation } from "react-router-dom"
import { useLoginPatientMutation } from "@/redux/apis/authApi"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock, Heart, ArrowRight } from "lucide-react"
import { toast } from "sonner"

const PatientLogin = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [showPassword, setShowPassword] = useState(false)
    const [loginPatient, { isLoading }] = useLoginPatientMutation()

    const loginSchema = z.object({
        email: z.string().email("Please enter a valid email address").min(1, "Email is required"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        rememberMe: z.boolean().optional()
    })

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false
        }
    })

    const handleFormSubmit = async (loginData) => {
        try {
            await loginPatient(loginData).unwrap()
            toast.success("Welcome back! Login successful.")
            
            const from = location.state?.from || '/customer/dashboard'
            navigate(from, {
                state: {
                    selectedServiceId: location.state?.selectedServiceId,
                    selectedServiceName: location.state?.selectedServiceName
                }
            })
        } catch (error) {
            toast.error(error?.data?.message || "Login failed. Check your email or password.")
            console.error('Login failed:', error)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
            </div>

            <Card className="max-w-md w-full shadow-2xl border-0 bg-white/95 backdrop-blur-sm relative z-10">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-linear-to-br from-primary to-primary/80 p-3 rounded-2xl shadow-lg">
                            <Heart className="w-8 h-8 text-white fill-white/20" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-bold">Patient Login</CardTitle>
                    <CardDescription className="text-base">
                        Login to access your health records and book services
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
                        {/* {apiError && (
                            <Alert variant="destructive">
                                <AlertDescription>
                                    {apiError?.data?.message || "Login failed. Please try again."}
                                </AlertDescription>
                            </Alert>
                        )} */}

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-semibold">
                                Email Address
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="patient@example.com"
                                    className="pl-10"
                                    {...register('email')}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-sm text-red-500">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-semibold">
                                Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    className="pl-10 pr-10"
                                    {...register('password')}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-sm text-red-500">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="rememberMe"
                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                    {...register('rememberMe')}
                                />
                                <Label htmlFor="rememberMe" className="text-sm cursor-pointer">
                                    Remember me
                                </Label>
                            </div>
                            <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                                Forgot password?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-linear-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Logging in...
                                </div>
                            ) : (
                                <>
                                    Login
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                    <div className="text-center text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link to="/customer/register" className="text-primary hover:underline font-semibold">
                            Register here
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}

export default PatientLogin