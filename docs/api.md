# API

Base path: `/api/v1`

Responses follow a consistent envelope:

```json
{
  "success": true,
  "message": "Data fetched successfully",
  "data": {}
}
```

Paginated endpoints include a `meta` object with `page`, `limit`, `total`, and `totalPages`.

## Modules

- `GET /health`
- `GET /workout-types`
- `POST /workout-types`
- `PUT /workout-types/:id`
- `DELETE /workout-types/:id`
- `GET /workouts`
- `POST /workouts`
- `PUT /workouts/:id`
- `DELETE /workouts/:id`
- `GET /schedules`
- `GET /schedules/day/:date`
- `POST /schedules`
- `PATCH /schedules/:id/complete`
- `GET /workout-sessions`
- `POST /workout-sessions`
- `PATCH /workout-sessions/:id/complete`
- `GET /meals`
- `POST /meals`
- `GET /goals`
- `POST /goals`
- `POST /progress/body`
- `GET /progress/body/history`
- `GET /dashboard/today`
- `GET /dashboard/weekly-summary`
- `GET /analytics/workouts`
- `GET /analytics/nutrition`
- `GET /analytics/progress`

Swagger UI is available at `/api/docs`.
