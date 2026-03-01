<?php

namespace Database\Seeders;

use App\Models\Profile\Ppid;
use Illuminate\Database\Seeder;

class PpidProfileSeeder extends Seeder
{

    public function run(): void
    {
        $ppidProfiles = collect([
            [
                'name' => 'Profil Singkat',
                'slug' => 'profil-singkat',
                'type' => 'json',
                'values' => [
                    "type" => "doc",
                    "content" => [
                        [
                            "type" => "heading",
                            "attrs" => [
                                "nid" => "718c5e98-1236-4bab-a762-0ae0c345df44",
                                "textAlign" => "left",
                                "level" => 1
                            ],
                            "content" => [
                                [
                                    "type" => "text",
                                    "text" => "Profil Singkat"
                                ]
                            ]
                        ],
                        [
                            "type" => "paragraph",
                            "attrs" => [
                                "nid" => "d532720e-904c-4b67-bd53-2b56e02ece04",
                                "textAlign" => "justify"
                            ],
                            "content" => [
                                [
                                    "type" => "text",
                                    "text" => "Keterbukaan Informasi menjadi hal yang sangat penting untuk mewujudkan "
                                ],
                                [
                                    "type" => "text",
                                    "marks" => [
                                        [
                                            "type" => "italic"
                                        ]
                                    ],
                                    "text" => "Good Governance"
                                ],
                                [
                                    "type" => "text",
                                    "text" => " dalam mendorong tata kelola pemerintahan yang baik, transparan, partisipatif dan dapat dipertanggungjawabkan. Hal tersebut telah diatur oleh pemerintah dengan dikeluarkannya "
                                ],
                                [
                                    "type" => "text",
                                    "marks" => [
                                        [
                                            "type" => "bold"
                                        ]
                                    ],
                                    "text" => "Undang-Undang (UU) Nomor 14 Tahun 2008"
                                ],
                                [
                                    "type" => "text",
                                    "text" => " tentang Keterbukaan Informasi Publik. Dalam UU tersebut disebutkan bahwa setiap Badan Publik wajib untuk menyampaikan informasi secara terbuka kepada publik sebagai bentuk pertanggungjawaban kepada masyarakat."
                                ]
                            ]
                        ]
                    ],
                ]
            ],
            [
                'name' => 'Visi & Misi',
                'slug' => 'visi-misi',
                'type' => 'json',
                'values' => [
                    "type" => "doc",
                    "content" => [
                        [
                            "type" => "heading",
                            "attrs" => [
                                "nid" => "718c5e98-1236-4bab-a762-0ae0c345df44",
                                "textAlign" => "left",
                                "level" => 1
                            ],
                            "content" => [
                                [
                                    "type" => "text",
                                    "text" => "Visi & Misi"
                                ]
                            ]
                        ],
                        [
                            "type" => "bulletList",
                            "content" => [
                                [
                                    "type" => "listItem",
                                    "content" => [
                                        [
                                            "type" => "paragraph",
                                            "attrs" => [
                                                "nid" => "d532720e-904c-4b67-bd53-2b56e02ece04",
                                                "textAlign" => "justify"
                                            ],
                                            "content" => [
                                                [
                                                    "type" => "text",
                                                    "marks" => [
                                                        [
                                                            "type" => "bold"
                                                        ]
                                                    ],
                                                    "text" => "Visi"
                                                ]
                                            ]
                                        ]
                                    ]
                                ]
                            ]
                        ],
                        [
                            "type" => "paragraph",
                            "attrs" => [
                                "nid" => "385e0e16-1d64-42cf-92d9-bd08175ac715",
                                "textAlign" => "justify"
                            ],
                            "content" => [
                                [
                                    "type" => "text",
                                    "text" => "Terwujudnya pelayanan informasi publik berkualitas untuk Indonesia maju"
                                ]
                            ]
                        ],
                        [
                            "type" => "paragraph",
                            "attrs" => [
                                "nid" => "c592da9e-5be2-4601-8a9b-323b47ae9007",
                                "textAlign" => "justify"
                            ]
                        ],
                        [
                            "type" => "bulletList",
                            "content" => [
                                [
                                    "type" => "listItem",
                                    "content" => [
                                        [
                                            "type" => "paragraph",
                                            "attrs" => [
                                                "nid" => "97aa5e48-8ffb-4cff-9cab-6ed5dbe4bb59",
                                                "textAlign" => "justify"
                                            ],
                                            "content" => [
                                                [
                                                    "type" => "text",
                                                    "marks" => [
                                                        [
                                                            "type" => "bold"
                                                        ]
                                                    ],
                                                    "text" => "Misi"
                                                ]
                                            ]
                                        ]
                                    ]
                                ]
                            ]
                        ],
                        [
                            "type" => "orderedList",
                            "attrs" => [
                                "start" => 1,
                                "type" => null
                            ],
                            "content" => [
                                [
                                    "type" => "listItem",
                                    "content" => [
                                        [
                                            "type" => "paragraph",
                                            "attrs" => [
                                                "nid" => "6264211c-2649-4471-aa78-46bdcb883a00",
                                                "textAlign" => "justify"
                                            ],
                                            "content" => [
                                                [
                                                    "type" => "text",
                                                    "text" => "Memberikan layanan informasi publik yang cepat dan akurat."
                                                ]
                                            ]
                                        ]
                                    ]
                                ],
                                [
                                    "type" => "listItem",
                                    "content" => [
                                        [
                                            "type" => "paragraph",
                                            "attrs" => [
                                                "nid" => "306f7a54-5c1e-4017-b277-8311b5821251",
                                                "textAlign" => "left"
                                            ],
                                            "content" => [
                                                [
                                                    "type" => "text",
                                                    "text" => "Menyediakan layanan informasi publik yang didukung oleh Sumber Daya Manusia yang profesional, berintegritas, dan amanah."
                                                ]
                                            ]
                                        ]
                                    ]
                                ],
                                [
                                    "type" => "listItem",
                                    "content" => [
                                        [
                                            "type" => "paragraph",
                                            "attrs" => [
                                                "nid" => "936cd86d-226b-4ed9-84ea-6e56d39d9ed7",
                                                "textAlign" => "left"
                                            ],
                                            "content" => [
                                                [
                                                    "type" => "text",
                                                    "text" => "Memanfaatkan teknologi informasi dan komunikasi yang mutakhir untuk mendukung pengelolaan keterbukaan informasi publik."
                                                ]
                                            ]
                                        ]
                                    ]
                                ]
                            ]
                        ],
                        [
                            "type" => "paragraph",
                            "attrs" => [
                                "nid" => "224c1cdc-42c8-4ea2-9c87-8cc89beea770",
                                "textAlign" => "left"
                            ]
                        ]
                    ]
                ]
            ],
            [
                'name' => 'Tugas & Fungsi',
                'slug' => 'tugas-fungsi',
                'type' => 'json',
                'values' => [
                    "type" => "doc",
                    "content" => [
                        [
                            "type" =>  "heading",
                            "attrs" =>  [
                                "nid" =>  "02c82947-5396-4a49-9bba-928782dd5c3a",
                                "textAlign" =>  "left",
                                "level" =>  1
                            ],
                            "content" =>  [
                                [
                                    "type" =>  "text",
                                    "text" =>  "Tugas dan Fungsi"
                                ]
                            ]
                        ],
                        [
                            "type" =>  "paragraph",
                            "attrs" =>  [
                                "nid" =>  "5c325794-baa6-4a3c-9ece-0167c8e0dd03",
                                "textAlign" =>  "left"
                            ]
                        ]
                    ]
                ],
            ],
            [
                'name' => 'Struktur Organisasi',
                'slug' => 'struktur-organisasi',
                'type' => 'json',
                'values' => [
                    "type" => "doc",
                    "content" => [
                        [
                            "type" =>  "heading",
                            "attrs" =>  [
                                "nid" =>  "d61e3b9a-e68a-45e6-986f-c1dbb7fd42e2",
                                "textAlign" =>  "left",
                                "level" =>  1
                            ],
                            "content" =>  [
                                [
                                    "type" =>  "text",
                                    "text" =>  "Struktur Organisasi"
                                ]
                            ]
                        ],
                        [
                            "type" =>  "paragraph",
                            "attrs" =>  [
                                "nid" =>  "c52a0937-4c68-465f-a97e-92eb8aadb543",
                                "textAlign" =>  "left"
                            ]
                        ]
                    ]
                ],
            ]
        ]);

        $ppidProfiles->each(function ($ppidProfile) {
            $p = Ppid::firstOrCreate([
                'slug' => $ppidProfile['slug']
            ], [
                'name' => $ppidProfile['name'],
                'type' => $ppidProfile['type'],
                'values' => $ppidProfile['values'],
            ]);

            $this->command->info("Created Ppid Profile: {$p->name} (was " . ($p->wasRecentlyCreated ? 'created' : 'existing') . ")");
        });
    }
}
