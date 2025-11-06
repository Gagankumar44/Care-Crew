import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// AR-Guided Range of Motion Analysis Page
/// Module 2.3: Physical therapy guidance and objective measurement
class ROMAnalysisPage extends ConsumerStatefulWidget {
  const ROMAnalysisPage({super.key});

  @override
  ConsumerState<ROMAnalysisPage> createState() => _ROMAnalysisPageState();
}

class _ROMAnalysisPageState extends ConsumerState<ROMAnalysisPage> {
  bool _isTracking = false;
  double _currentAngle = 0.0;
  double _maxAngle = 0.0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('ROM Analysis'),
      ),
      body: Stack(
        children: [
          // Camera View with MediaPipe Overlay
          _buildCameraView(),
          
          // AR Overlay (Virtual Coach)
          if (_isTracking) _buildARCoach(),
          
          // Measurement Display
          if (_isTracking) _buildMeasurementDisplay(),
          
          // Exercise Selection Panel
          if (!_isTracking) _buildExercisePanel(),
          
          // Controls
          if (_isTracking) _buildTrackingControls(),
        ],
      ),
    );
  }

  Widget _buildCameraView() {
    return Container(
      color: Colors.black,
      child: Center(
        child: _isTracking
            ? Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text(
                    'MediaPipe Pose Tracking',
                    style: TextStyle(color: Colors.white),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    '33 3D Landmarks Detected',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: Colors.white70,
                    ),
                  ),
                ],
              )
            : const Icon(
                Icons.person,
                size: 128,
                color: Colors.white54,
              ),
      ),
    );
  }

  Widget _buildARCoach() {
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
                  Icons.accessibility_new,
                  color: Colors.green,
                  size: 20,
                ),
                const SizedBox(width: 8),
                Text(
                  'Shoulder Abduction',
                  style: Theme.of(context).textTheme.titleSmall?.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              'Lift your arm 10 degrees higher',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: Colors.white,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMeasurementDisplay() {
    return Positioned(
      bottom: 120,
      left: 16,
      right: 16,
      child: Card(
        color: Colors.black87,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Current Measurement',
                style: Theme.of(context).textTheme.titleSmall?.copyWith(
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Current Angle',
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: Colors.white70,
                        ),
                      ),
                      Text(
                        '${_currentAngle.toStringAsFixed(1)}°',
                        style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(
                        'Max Angle',
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: Colors.white70,
                        ),
                      ),
                      Text(
                        '${_maxAngle.toStringAsFixed(1)}°',
                        style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                          color: Colors.green,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildExercisePanel() {
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
            'Select Exercise',
            style: Theme.of(context).textTheme.headlineMedium,
          ),
          const SizedBox(height: 16),
          _buildExerciseCard(
            title: 'Shoulder Abduction',
            description: '3 sets of 10 repetitions',
            icon: Icons.accessibility_new,
          ),
          const SizedBox(height: 12),
          _buildExerciseCard(
            title: 'Knee Flexion',
            description: '2 sets of 15 repetitions',
            icon: Icons.directions_walk,
          ),
          const SizedBox(height: 12),
          _buildExerciseCard(
            title: 'Hip Extension',
            description: '3 sets of 12 repetitions',
            icon: Icons.fitness_center,
          ),
        ],
      ),
    );
  }

  Widget _buildExerciseCard({
    required String title,
    required String description,
    required IconData icon,
  }) {
    return Card(
      child: ListTile(
        leading: Icon(icon, color: Theme.of(context).colorScheme.primary),
        title: Text(
          title,
          style: Theme.of(context).textTheme.titleSmall?.copyWith(
            fontWeight: FontWeight.w600,
          ),
        ),
        subtitle: Text(description),
        trailing: const Icon(Icons.arrow_forward_ios),
        onTap: () {
          setState(() {
            _isTracking = true;
          });
        },
      ),
    );
  }

  Widget _buildTrackingControls() {
    return Positioned(
      bottom: 40,
      left: 0,
      right: 0,
      child: Center(
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Stop Button
            ElevatedButton.icon(
              onPressed: () {
                setState(() {
                  _isTracking = false;
                  // TODO: Save ROM data to local database
                });
              },
              icon: const Icon(Icons.stop),
              label: const Text('Stop & Save'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Theme.of(context).colorScheme.error,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

