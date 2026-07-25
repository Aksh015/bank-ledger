output "ecs_cluster_name" {
  value = aws_ecs_cluster.this.name
}

output "task_definition_family" {
  value = aws_ecs_task_definition.app.family
}

output "cloudwatch_log_group" {
  value = aws_cloudwatch_log_group.app.name
}
