import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import z from "zod"
import { useNavigate, Link } from "react-router-dom"
import { useRegisterNurseMutation } from "@/redux/apis/authApi"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock, User, Phone, Briefcase, ArrowRight } from "lucide-react"
import { toast } from "sonner"

const NurseRegister = () => {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [registerNurse, { isLoading }] = useRegisterNurseMutation()

    const registerSchema = z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Please enter a valid email address"),
        mobile: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"),
        password: z.string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[a-z]/, "Must contain at least one lowercase letter")
            .regex(/[A-Z]/, "Must contain at least one uppercase letter")
            .regex(/[0-9]/, "Must contain at least one number")
            .regex(/[^a-zA-Z0-9]/, "Must contain at least one special character"),
        confirmPassword: z.string()
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"]
    })

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            mobile: "",
            password: "",
            confirmPassword: ""
        }
    })

    const handleFormSubmit = async (formData) => {
        try {
            const { confirmPassword, ...submitData } = formData
            await registerNurse(submitData).unwrap()
            toast.success("Caregiver account registered successfully! Please log in to complete your KYC.")
            navigate("/nurse/login")
        } catch (error) {
            toast.error(error?.data?.message || "Registration failed. Try again.")
            console.error("Nurse Registration failed:", error)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 via-white to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
            </div>

            <Card className="max-w-md w-full shadow-2xl border-0 bg-white/95 backdrop-blur-xs relative z-10">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-linear-to-br from-emerald-600 to-teal-500 p-3 rounded-2xl shadow-lg">
                            <Briefcase className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-bold tracking-tight text-slate-800 font-sans">Caregiver Register</CardTitle>
                    <CardDescription className="text-sm text-slate-500">
                        Join CareNest as a professional nurse or healthcare provider
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                        {/* Name */}
                        <div className="space-y-1">
                            <Label htmlFor="name" className="text-slate-700">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="name"
                                    placeholder="Dr./Nurse Jane Doe"
                                    className="pl-10 focus:ring-emerald-500 focus:border-emerald-500"
                                    {...register('name')}
                                />
                            </div>
                            {errors.name && (
                                <p className="text-xs text-red-500">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-1">
                            <Label htmlFor="email" className="text-slate-700">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="nurse@carenest.com"
                                    className="pl-10 focus:ring-emerald-500 focus:border-emerald-500"
                                    {...register('email')}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-xs text-red-500">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Mobile */}
                        <div className="space-y-1">
                            <Label htmlFor="mobile" className="text-slate-700">Mobile Number (WhatsApp Enabled)</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="mobile"
                                    placeholder="9876543210"
                                    className="pl-10 focus:ring-emerald-500 focus:border-emerald-500"
                                    {...register('mobile')}
                                />
                            </div>
                            {errors.mobile && (
                                <p className="text-xs text-red-500">{errors.mobile.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-1">
                            <Label htmlFor="password" className="text-slate-700">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    className="pl-10 pr-10 focus:ring-emerald-500 focus:border-emerald-500"
                                    {...register('password')}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-slate-800"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-xs text-red-500 leading-normal">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-1">
                            <Label htmlFor="confirmPassword" className="text-slate-700">Confirm Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="confirmPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    className="pl-10 focus:ring-emerald-500 focus:border-emerald-500"
                                    {...register('confirmPassword')}
                                />
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-linear-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold h-11 shadow-md hover:shadow-lg transition-all duration-300 mt-2"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2 justify-center">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Registering...
                                </div>
                            ) : (
                                <>
                                    Register as Caregiver
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4 border-t border-slate-100 py-4">
                    <div className="text-center text-sm text-slate-500">
                        Already have a caregiver account?{" "}
                        <Link to="/nurse/login" className="text-emerald-600 hover:underline font-bold">
                            Login here
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}

export default NurseRegister
