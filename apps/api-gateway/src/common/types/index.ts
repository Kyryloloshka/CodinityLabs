// User-related types
export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
}

// Submission status types
export enum SubmissionStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

// Error severity types
export enum ErrorSeverity {
  WARNING = 1,
  ERROR = 2,
}

// Common interfaces
export interface UserInfo {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface TestStats {
  total: number;
  passed: number;
  failed: number;
  timeout: number;
  public: number;
}

export interface AssignmentCount {
  submissions: number;
}

export interface ErrorDetails {
  code: string;
  message: string;
  details?: string[];
}

// Settings interfaces
export interface BaseSettings {
  timeout?: number;
  maxAttempts?: number | null;
  passingThreshold?: number;
  allowPartialScore?: boolean;
  strictMode?: boolean;
}

export interface AssignmentSettings extends BaseSettings {
  id: string;
  assignmentId: string;
  timeout: number;
  maxAttempts: number | null;
  passingThreshold: number;
  allowPartialScore: boolean;
  strictMode: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CheckSettings = BaseSettings;

// Test case interfaces
export interface BaseTestCase {
  input: string;
  expected: string;
  description: string;
}

export interface TestCase extends BaseTestCase {
  id: string;
  isPublic: boolean;
  assignmentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTestCase extends BaseTestCase {
  isPublic?: boolean;
}

// Lint error interface
export interface LintError {
  ruleId: string;
  severity: number;
  message: string;
  line: number;
  column: number;
}

// Test result interface
export interface TestResult {
  passed: boolean;
  actual: string;
  expected: string;
  description: string;
  input: string;
}

// Check result interface
export interface CheckResult {
  lint: LintError[];
  tests: TestResult[];
  score: number;
  testStats: TestStats;
  passedThreshold: boolean;
  settings: CheckSettings;
}

// Assignment interfaces
export interface Assignment {
  id: string;
  title: string;
  description: string;
  difficulty: number;
  deadline: string;
  teacherId: string;
  createdAt: string;
  updatedAt: string;
  testCases: TestCase[];
  settings?: AssignmentSettings;
  _count: AssignmentCount;
}

export interface CreateAssignment {
  title: string;
  description: string;
  difficulty: number;
  deadline: string;
  teacherId: string;
  testCases: CreateTestCase[];
  settings?: CreateAssignmentSettings;
}

export interface UpdateAssignment {
  title?: string;
  description?: string;
  difficulty?: number;
  deadline?: string;
  teacherId?: string;
  testCases?: CreateTestCase[];
  settings?: CreateAssignmentSettings;
}

export interface CreateAssignmentSettings {
  timeout?: number;
  maxAttempts?: number | null;
  passingThreshold?: number;
  allowPartialScore?: boolean;
  strictMode?: boolean;
}

// Submission interfaces
export interface Submission {
  id: string;
  userId: string;
  assignmentId: string;
  code: string;
  language?: string;
  eslintReport: any;
  testResults: any;
  score: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  assignment: any;
}

export interface CreateSubmission {
  userId: string;
  assignmentId: string;
  code: string;
  language?: string;
}

// Check request interface
export interface CheckRequest {
  code: string;
  language?: string;
  assignmentId?: string;
  userId?: string;
  testCases?: BaseTestCase[];
  settings?: CheckSettings;
}

// Auth response interfaces
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserInfo;
}

export interface ClientAuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserInfo;
}

// Service-specific interfaces
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedApiResponse<T> {
  data: {
    data: T[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
  message?: string;
}

export interface ErrorResponse {
  message?: string;
  error?: {
    message?: string;
  };
}

export interface UserStatistics {
  userId: string;
  totalSubmissions: number;
  successfulSubmissions: number;
  averageScore: number;
  lastSubmissionDate?: string;
}

export interface AssignmentStatistics {
  assignmentId: string;
  totalSubmissions: number;
  uniqueUsers: number;
  averageScore: number;
  userStatistics: UserStatistics[];
}

export interface UserStatisticsWithUser extends UserStatistics {
  user: UserInfo;
}

export interface AssignmentStatisticsWithUsers
  extends Omit<AssignmentStatistics, 'userStatistics'> {
  userStatistics: UserStatisticsWithUser[];
}

export interface MaxAttemptsCheck {
  canSubmit: boolean;
  currentAttempts: number;
  maxAttempts: number | null;
}
