-- CreateTable
CREATE TABLE "students" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "registration_number" TEXT NOT NULL,
    "foreign_language_code" TEXT,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjects" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_scores" (
    "student_id" INTEGER NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "score" DECIMAL(4,2) NOT NULL,

    CONSTRAINT "student_scores_pkey" PRIMARY KEY ("student_id","subject_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "students_registration_number_key" ON "students"("registration_number");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_code_key" ON "subjects"("code");

-- CreateIndex
CREATE INDEX "student_scores_subject_id_score_idx" ON "student_scores"("subject_id", "score");

-- AddForeignKey
ALTER TABLE "student_scores" ADD CONSTRAINT "student_scores_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_scores" ADD CONSTRAINT "student_scores_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "student_scores" ADD CONSTRAINT "student_scores_score_range_check" CHECK ("score" >= 0 AND "score" <= 10);