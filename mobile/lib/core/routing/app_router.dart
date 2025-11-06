import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../features/auth/presentation/pages/login_page.dart';
import '../../features/auth/presentation/pages/register_page.dart';
import '../../features/auth/presentation/pages/onboarding_page.dart';
import '../../features/auth/presentation/providers/auth_provider.dart';
import '../../features/triage/presentation/pages/triage_page.dart';
import '../../features/skin_check/presentation/pages/skin_check_page.dart';
import '../../features/rom_analysis/presentation/pages/rom_analysis_page.dart';
import '../../features/consultation/presentation/pages/consultation_page.dart';
import '../../features/settings/presentation/pages/settings_page.dart';

class AppRouter {
  static final GoRouter router = GoRouter(
    initialLocation: '/onboarding',
    redirect: (context, state) {
      // Check authentication status
      final authState = ProviderScope.containerOf(context).read(authProvider);
      
      final isLoggedIn = authState.isAuthenticated;
      final isLoggingIn = state.uri.path == '/login' || state.uri.path == '/register';
      
      // Redirect to login if not authenticated and not already logging in
      if (!isLoggedIn && !isLoggingIn && state.uri.path != '/onboarding') {
        return '/login';
      }
      
      // Redirect to dashboard if already logged in and on login/register pages
      if (isLoggedIn && (state.uri.path == '/login' || state.uri.path == '/register' || state.uri.path == '/onboarding')) {
        return '/dashboard';
      }
      
      return null; // No redirect needed
    },
    routes: [
      GoRoute(
        path: '/onboarding',
        name: 'onboarding',
        builder: (context, state) => const OnboardingPage(),
      ),
      GoRoute(
        path: '/login',
        name: 'login',
        builder: (context, state) => const LoginPage(),
      ),
      GoRoute(
        path: '/register',
        name: 'register',
        builder: (context, state) => const RegisterPage(),
      ),
      GoRoute(
        path: '/dashboard',
        name: 'dashboard',
        builder: (context, state) => const DashboardPage(),
      ),
      GoRoute(
        path: '/triage',
        name: 'triage',
        builder: (context, state) => const TriagePage(),
      ),
      GoRoute(
        path: '/skin-check',
        name: 'skin-check',
        builder: (context, state) => const SkinCheckPage(),
      ),
      GoRoute(
        path: '/rom-analysis',
        name: 'rom-analysis',
        builder: (context, state) => const ROMAnalysisPage(),
      ),
      GoRoute(
        path: '/consultation',
        name: 'consultation',
        builder: (context, state) => const ConsultationPage(),
      ),
      GoRoute(
        path: '/settings',
        name: 'settings',
        builder: (context, state) => const SettingsPage(),
      ),
    ],
  );
}

