import 'package:flutter/material.dart';
import 'package:charts_flutter/flutter.dart' as charts;
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/models/rom_record.dart';
import '../../../../core/repositories/data_repositories.dart';

/// ROM Chart Widget - Displays ROM progress over time
class ROMChartWidget extends ConsumerWidget {
  final String exerciseId;

  const ROMChartWidget({
    super.key,
    required this.exerciseId,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // TODO: Load actual ROM records from repository
    // For now, use mock data
    final mockData = _generateMockData();

    return charts.TimeSeriesChart(
      [
        charts.Series<TimeSeriesAngle, DateTime>(
          id: 'ROM',
          colorFn: (_, __) => charts.MaterialPalette.blue.shadeDefault,
          domainFn: (TimeSeriesAngle data, _) => data.time,
          measureFn: (TimeSeriesAngle data, _) => data.angle,
          data: mockData,
        ),
      ],
      animate: true,
      primaryMeasureAxis: const charts.NumericAxisSpec(
        tickProviderSpec: charts.BasicNumericTickProviderSpec(
          desiredTickCount: 5,
        ),
        renderSpec: charts.GridlineRendererSpec(
          labelStyle: charts.TextStyleSpec(
            fontSize: 12,
          ),
        ),
      ),
      domainAxis: const charts.DateTimeAxisSpec(
        tickProviderSpec: charts.AutoDateTimeTickProviderSpec(
          includeTime: false,
        ),
        renderSpec: charts.SmallTickRendererSpec(
          labelStyle: charts.TextStyleSpec(
            fontSize: 12,
          ),
        ),
      ),
    );
  }

  List<TimeSeriesAngle> _generateMockData() {
    final now = DateTime.now();
    return List.generate(7, (index) {
      final date = now.subtract(Duration(days: 6 - index));
      return TimeSeriesAngle(
        time: date,
        angle: 60.0 + (index * 5.0) + (index % 2 == 0 ? 3.0 : -2.0),
      );
    });
  }
}

class TimeSeriesAngle {
  final DateTime time;
  final double angle;

  TimeSeriesAngle({
    required this.time,
    required this.angle,
  });
}

