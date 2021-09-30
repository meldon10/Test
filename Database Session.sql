INSERT INTO "sap_acs_servicemanagement_Todo" (
    createdAt,
    createdBy,
    due_by,
    modifiedAt,
    priority,
    status,
    task_description,
    TASK_ID,
    task_name
  )
VALUES
  (
    'createdAt:TIMESTAMP_TEXT',
    'createdBy:NVARCHAR(255)',
    'due_by:TIMESTAMP_TEXT',
    'modifiedAt:TIMESTAMP_TEXT',
    'priority:NVARCHAR(50)',
    'status:NVARCHAR(50)',
    'task_description:NVARCHAR(250)',
    'TASK_ID:NVARCHAR(36)',
    'task_name:NVARCHAR(50)'
  );