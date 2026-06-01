import { ClassItem, Submission } from "./types";

export const DEFAULT_CLASSES: ClassItem[] = [
  { 
    id: "mat-10", 
    name: "Matematika X-IPA 1", 
    code: "M3-IPA1", 
    teacher: "Ibu Sri Rahayu, M.Pd.", 
    bg: "bg-[#D3E4FF]", 
    textColor: "text-[#001D35]", 
    icon: "Hash", 
    students: 32,
    materials: [
      { id: "mat-m1", title: "Materi Aljabar Linear Dasar.pdf", size: "2.4 MB" },
      { id: "mat-m2", title: "Latihan Soal Matriks & Vektor.pdf", size: "1.8 MB" }
    ],
    quizzes: [
      { 
        id: "mat-q1", 
        title: "Modul Quiz: Persamaan Kuadrat", 
        duration: "15 Menit", 
        done: false, 
        score: null,
        type: "quiz",
        questions: [
          {
            id: "mat-q1-1",
            text: "Akar-akar dari persamaan kuadrat x² - 5x + 6 = 0 adalah...",
            type: "pilihan_ganda",
            options: ["A. 2 dan 3", "B. -2 dan -3", "C. 1 dan 6", "D. -1 dan -6"],
            correctAnswer: "A"
          },
          {
            id: "mat-q1-2",
            text: "Nilai diskriminan dari persamaan x² - 4x + 4 = 0 adalah...",
            type: "pilihan_ganda",
            options: ["A. 0", "B. 4", "C. -4", "D. 16"],
            correctAnswer: "A"
          },
          {
            id: "mat-q1-3",
            text: "Jelaskan konsep diskriminan (D = b² - 4ac) dan pengaruh nilainya terhadap jenis-jenis akar persamaan kuadrat!",
            type: "esai"
          }
        ]
      }
    ],
    discussions: [
      { id: "mat-d1", sender: "Ibu Sri Rahayu", text: "Jangan lupa untuk mempelajari bab perkalian matriks ya sebelum kuis besok!", date: "Hari ini, 08:30" }
    ]
  },
  { 
    id: "fis-11", 
    name: "Fisika Kelas XI Dasar", 
    code: "M3-FIS1", 
    teacher: "Bpk. Budi Santoso, S.Si.", 
    bg: "bg-[#FFDAD6]", 
    textColor: "text-[#410002]", 
    icon: "Zap", 
    students: 28,
    materials: [
      { id: "fis-m1", title: "Modul Kinematika Gerak Lurus.pdf", size: "3.2 MB" },
      { id: "fis-m2", title: "Praktikum Ayunan Sederhana.pdf", size: "2.1 MB" }
    ],
    quizzes: [
      { 
        id: "fis-q1", 
        title: "Uji Kompetensi: Gerak Melingkar", 
        duration: "20 Menit", 
        done: false, 
        score: null,
        type: "ujian",
        questions: [
          {
            id: "fis-q1-1",
            text: "Sebuah partikel bergerak melingkar dengan kecepatan sudut konstan. Gaya yang menariknya ke pusat lingkaran disebut gaya...",
            type: "pilihan_ganda",
            options: ["A. Sentripetal", "B. Gravitasi", "C. Gesek", "D. Sentrifugal"],
            correctAnswer: "A"
          },
          {
            id: "fis-q1-2",
            text: "Jelaskan perbedaan mendasar antara kecepatan sudut (omega) dengan kecepatan linier (v) pada suatu benda yang bergerak melingkar!",
            type: "esai"
          }
        ]
      }
    ],
    discussions: [
      { id: "fis-d1", sender: "Bpk. Budi Santoso", text: "Tugas lembar kerja fisika minggu lalu harap dikumpulkan paling lambat jam dinas hari ini.", date: "Kemarin, 10:15" }
    ]
  },
  { 
    id: "bio-12", 
    name: "Biologi Lanjutan XII", 
    code: "M3-BIO2", 
    teacher: "Ibu Linda Wijaya, M.Bio.", 
    bg: "bg-[#C0EFEF]", 
    textColor: "text-[#002020]", 
    icon: "BookOpen", 
    students: 30,
    materials: [
      { id: "bio-m1", title: "Struktur Sel & Enzim.pdf", size: "1.4 MB" },
      { id: "bio-m2", title: "Modul Ekspresi Gen & Sintesis Protein.pdf", size: "4.1 MB" }
    ],
    quizzes: [
      { 
        id: "bio-q1", 
        title: "Quiz Harian: Struktur DNA", 
        duration: "10 Menit", 
        done: false, 
        score: null,
        type: "quiz",
        questions: [
          {
            id: "bio-q1-1",
            text: "Basa nitrogen berikut yang tidak terdapat pada struktur DNA adalah...",
            type: "pilihan_ganda",
            options: ["A. Urasil", "B. Timin", "C. Adenin", "D. Guanin"],
            correctAnswer: "A"
          },
          {
            id: "bio-q1-2",
            text: "Mengapa struktur DNA digambarkan sebagai heliks ganda (double helix) searah antiparalel?",
            type: "esai"
          }
        ]
      }
    ],
    discussions: [
      { id: "bio-d1", sender: "Ibu Linda Wijaya", text: "Halo semuanya, hasil nilai quiz materi genetika sudah saya rilis ya di aplikasi.", date: "2 hari yang lalu" }
    ]
  }
];

export const DEFAULT_SUBMISSIONS: Submission[] = [
  {
    id: "sub-1",
    classId: "mat-10",
    className: "Matematika X-IPA 1",
    quizId: "mat-q1",
    quizTitle: "Modul Quiz: Persamaan Kuadrat",
    studentName: "Aditya Pratama",
    studentEmail: "aditya.pratama@siswa.id",
    submitDate: "Hari ini, 12:45",
    scoreMc: 100,
    scoreEssay: null,
    finalScore: null,
    essayAnswers: [
      {
        questionId: "mat-q1-3",
        questionText: "Jelaskan konsep diskriminan (D = b² - 4ac) dan pengaruh nilainya terhadap jenis-jenis akar persamaan kuadrat!",
        studentAnswer: "Diskriminan menentukan jenis akar. Jika D > 0, akarnya real & berbeda. Jika D = 0, akarnya real kembar (sama). Jika D < 0, tidak memiliki akar real (akarnya imajiner). Rumus ABC adalah x = (-b ± √D) / 2a.",
        score: null
      }
    ],
    status: "perlu_koreksi"
  },
  {
    id: "sub-2",
    classId: "fis-11",
    className: "Fisika Kelas XI Dasar",
    quizId: "fis-q1",
    quizTitle: "Uji Kompetensi: Gerak Melingkar",
    studentName: "Rian Hidayat",
    studentEmail: "rian.hidayat@siswa.id",
    submitDate: "Kemarin, 14:20",
    scoreMc: 100,
    scoreEssay: 80,
    finalScore: 90,
    essayAnswers: [
      {
        questionId: "fis-q1-2",
        questionText: "Jelaskan perbedaan mendasar antara kecepatan sudut (omega) dengan kecepatan linier (v) pada suatu benda yang bergerak melingkar!",
        studentAnswer: "Kecepatan sudut mengukur seberapa cepat sudut berubah terhadap waktu di pusat lingkaran, sedangkan kecepatan linear mengukur kecepatan benda di sepanjang lintasan luar lingkaran.",
        score: 80
      }
    ],
    status: "selesai"
  }
];
