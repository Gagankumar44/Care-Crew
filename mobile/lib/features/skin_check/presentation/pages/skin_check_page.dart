import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// AR-Guided Dermatological Analysis Page
/// Module 2.2: Skin condition scanning and risk assessment
class SkinCheckPage extends ConsumerStatefulWidget {
  const SkinCheckPage({super.key});

  @override
  ConsumerState<SkinCheckPage> createState() => _SkinCheckPageState();
}

class _SkinCheckPageState extends ConsumerState<SkinCheckPage> {
  bool _isARActive = false;
  bool _isCapturing = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Skin Check'),
      ),
      body: Stack(
        children: [
          // AR Camera View (placeholder)
          _buildARView(),
          
          // AR Overlay Guidance
          if (_isARActive) _buildAROverlay(),
          
          // Instructions Panel
          if (!_isARActive) _buildInstructionsPanel(),
          
          // Capture Button
          if (_isARActive) _buildCaptureControls(),
        ],
      ),
    );
  }

  Widget _buildARView() {
    return Container(
      color: Colors.black,
      child: Center(
        child: _isARActive
            ? const Text(
                'ARKit/ARCore Camera View',
                style: TextStyle(color: Colors.white),
              )
            : const Icon(
                Icons.camera_alt,
                size: 64,
                color: Colors.white54,
              ),
      ),
    );
  }

  Widget _buildAROverlay() {
    return Positioned(
      top: 40,
      left: 16,
      right: 16,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.black87,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.lightbulb_outline,
                  color: Colors.yellow,
                  size: 20,
                ),
                const SizedBox(width: 8),
                Text(
                  'AR Guidance',
                  style: Theme.of(context).textTheme.titleSmall?.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              'Move closer to your skin',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: Colors.white,
              ),
            ),
            Text(
              'More light needed',
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                color: Colors.orange,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInstructionsPanel() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Theme.of(context).scaffoldBackgroundColor,
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(24),
          topRight: Radius.circular(24),
        ),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'AR-Guided Skin Check',
            style: Theme.of(context).textTheme.headlineMedium,
          ),
          const SizedBox(height: 16),
          _buildInstructionItem(
            icon: Icons.wb_sunny,
            title: 'Find a well-lit area',
            description: 'Natural light is best for accurate scanning',
          ),
          const SizedBox(height: 12),
          _buildInstructionItem(
            icon: Icons.straighten,
            title: 'Hold steady',
            description: 'Keep your device 15-20cm from your skin',
          ),
          const SizedBox(height: 12),
          _buildInstructionItem(
            icon: Icons.my_location,
            title: 'Mark the location',
            description: 'After capture, place a marker on your body map',
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () {
                setState(() {
                  _isARActive = true;
                });
              },
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
              child: const Text('Start AR Scan'),
            ),
          ),
          const SizedBox(height: 16),
          // Consent Checkbox (GDPR Art. 9)
          _buildConsentCheckbox(),
        ],
      ),
    );
  }

  Widget _buildInstructionItem({
    required IconData icon,
    required String title,
    required String description,
  }) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, color: Theme.of(context).colorScheme.primary),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: Theme.of(context).textTheme.titleSmall?.copyWith(
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                description,
                style: Theme.of(context).textTheme.bodySmall,
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildConsentCheckbox() {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Checkbox(
          value: true, // TODO: Implement actual consent state
          onChanged: (value) {},
        ),
        Expanded(
          child: Text(
            'I consent to capture and analyze my skin image for medical risk assessment. '
            'Data will be encrypted and HIPAA-compliant. (GDPR Art. 9)',
            style: Theme.of(context).textTheme.bodySmall,
          ),
        ),
      ],
    );
  }

  Widget _buildCaptureControls() {
    return Positioned(
      bottom: 40,
      left: 0,
      right: 0,
      child: Center(
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Cancel Button
            TextButton(
              onPressed: () {
                setState(() {
                  _isARActive = false;
                });
              },
              child: const Text('Cancel'),
            ),
            const SizedBox(width: 24),
            // Capture Button
            GestureDetector(
              onTap: () {
                // TODO: Capture image with AR guidance
                setState(() {
                  _isCapturing = true;
                });
              },
              child: Container(
                width: 72,
                height: 72,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.white,
                  border: Border.all(color: Colors.grey, width: 4),
                ),
                child: _isCapturing
                    ? const Center(
                        child: CircularProgressIndicator(),
                      )
                    : const Icon(
                        Icons.camera_alt,
                        size: 32,
                        color: Colors.black,
                      ),
              ),
            ),
            const SizedBox(width: 24),
            // Placeholder for next button
            const SizedBox(width: 48),
          ],
        ),
      ),
    );
  }
}

