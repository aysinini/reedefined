const TRANSLATIONS = {
  en: {
    // Nav
    'nav.magazine': 'The Magazine',
    'nav.discover': 'Discover',
    'nav.illustrators': 'Illustrators',
    'nav.connections': 'Connections',
    'nav.write': 'Write',
    'nav.advertise': 'Advertise',
    'nav.signin': 'Sign In',
    'nav.join': 'Sign Up →',
    'nav.back': 'Back to Studio →',

    // Index
    'index.eyebrow': 'Issue No. 1 · May 2026',
    'index.h1': 'The magazine<br><em>shaped by the<br>people you follow.</em>',
    'index.sub': 'Every month a personalised issue — assembled from the columns, playlists, film diaries and wardrobes of the contributors you choose to follow.',
    'index.join': 'Join the Waitlist →',
    'index.read': 'Read Issue No. 1',
    'index.how': 'How it works',
    'index.step1.title': 'Follow contributors',
    'index.step1.desc': 'Browse our contributing editors. Follow the ones whose taste you trust — cinema critics, food writers, fashion editors.',
    'index.step2.title': 'They connect their world',
    'index.step2.desc': 'Contributors link their Spotify, Letterboxd, Instagram and more. Their real life becomes their column.',
    'index.step3.title': 'Your issue drops',
    'index.step3.desc': 'On the 1st of every month, your personalised issue is ready. No two readers get the same magazine.',

    // Portal
    'portal.signin': 'Sign in',
    'portal.signup': 'Create account',
    'portal.email': 'Email address',
    'portal.password': 'Password',
    'portal.name': 'Full name',
    'portal.role.reader': 'I want to read',
    'portal.role.contrib': 'I want to contribute',
    'portal.forgot': 'Forgot password?',
    'portal.reset': 'Send reset link',
    'portal.no_account': "Don't have an account?",
    'portal.have_account': 'Already have an account?',
    'portal.waitlist.name': 'Your name',
    'portal.waitlist.email': 'Email address',
    'portal.waitlist.join': 'Sign Up →',
    'portal.waitlist.thanks': 'You\'re on the list.',

    // Newsstand
    'newsstand.eyebrow': 'Issue No. 1 · May 2026',
    'newsstand.welcome': 'Good morning.',
    'newsstand.sub': 'Your personalised issue is ready.',
    'newsstand.open': 'Open Flip Reader →',
    'newsstand.contributors': 'Your contributors',
    'newsstand.discover': 'Discover more →',
    'newsstand.following': 'Following',
    'newsstand.follow': 'Follow',

    // Discover
    'discover.eyebrow': 'Issue No. 1 · May 2026',
    'discover.h1': 'Discover<br><em>who to follow.</em>',
    'discover.sub': 'Browse the contributors who write for Reedefined — and see the public issues of people whose taste you admire.',
    'discover.featured': 'Featured This Month',
    'discover.contributors': 'Contributing Editors',
    'discover.public': 'Public Issues',
    'discover.follow': 'Follow',
    'discover.following': 'Following',
    'discover.search': 'Search contributors, interests, names…',

    // Connections
    'conn.eyebrow': 'Contributing Editor',
    'conn.h1': 'Connect your<br><em>platforms.</em>',
    'conn.sub': 'Pull your content directly into your column.',
    'conn.connected': 'connected',
    'conn.of': 'of',
    'conn.official': 'Official APIs only — no scraping',
    'conn.never_post': 'We never post on your behalf',
    'conn.connect': 'Connect',
    'conn.coming': 'Coming Soon',
    'conn.pending': 'Pending Approval',
    'conn.disconnect': 'Disconnect',
    'conn.privacy': 'Privacy note',
    'conn.privacy_text': 'We only read public data via official APIs. We never post, like, follow or take any action on your behalf.',

    // Cover brief
    'brief.eyebrow': 'Open Call · Issue No. 2 · June 2026',
    'brief.h1': 'Cover<br>Brief.',
    'brief.sub': 'We are looking for an illustrator for the cover of Issue No. 2. Open to all.',
    'brief.submit': 'Submit My Work →',
    'brief.submitting': 'Submitting…',

    // Advertise
    'adv.eyebrow': 'Brand Partnerships',
    'adv.h1': 'Reach the people<br>who pay attention.',
    'adv.sub': 'Reedefined readers don\'t scroll. They read.',
    'adv.enquire': 'Enquire About Advertising →',
    'adv.formats': 'See Ad Formats',
    'adv.send': 'Send Enquiry →',

    // Dashboard
    'dash.eyebrow': 'My Dashboard',
    'dash.h1': "Your writer's desk",
    'dash.published': 'Published',
    'dash.drafts': 'Drafts',
    'dash.followers': 'Followers',
    'dash.following': 'Following',
    'dash.your_columns': 'Your columns',
    'dash.write_new': 'Write a new one →',
    'dash.follow_h': 'Contributors you follow',
    'dash.discover_more': 'Discover more →',
    'dash.empty_published': 'Nothing published yet.',
    'dash.empty_drafts': 'No drafts in progress.',
    'dash.empty_followers': 'No followers yet.',
    'dash.empty_following': 'Not following anyone yet.',

    // Profile
    'profile.archive': 'Archive',
    'profile.empty': 'No published columns yet.',

    // Profile edit
    'pe.eyebrow': 'Your Profile',
    'pe.h1': 'Edit your profile',
    'pe.upload': 'Upload Photo',
    'pe.hint': 'Square photos work best. Max 8MB.',
    'pe.location': 'Location',
    'pe.location_ph': 'e.g. Istanbul, Turkey',
    'pe.bio': 'Bio',
    'pe.bio_ph': 'A line or two about you — what you write about, your taste, your background.',
    'pe.save': 'Save Profile',

    // Article
    'art.flip': 'Read in flip format ⇄',
    'art.back': '← Back',
    'art.comments': 'Comments',
    'art.post': 'Post',
    'art.sign_comment': 'Sign in to leave a comment →',
    'art.no_comments': 'No comments yet — be the first.',
    'art.add_comment': 'Add a comment…',

    // Choose screen
    'choose.welcome': 'Welcome back',
    'choose.h1': 'What would you like to do?',
    'choose.sub': "You're both a reader and a contributor. Pick where you want to go — you can always switch later.",
    'choose.read_t': 'I want to read',
    'choose.read_d': 'Open your personal issue, flip through past issues, and discover new people to follow.',
    'choose.read_cta': 'Go to Newsstand →',
    'choose.write_t': 'I want to contribute',
    'choose.write_d': 'Write your column, manage your submissions, and see how your writing is doing.',
    'choose.write_cta': 'Go to Contributor Portal →',

    // Guidelines
    'gl.eyebrow': 'Contributor Info',
    'gl.h1': 'How to contribute',
    'gl.intro': "Reedefined is written entirely by its readers. Anyone can become a contributor — there's no application, no pitch process. You choose your topic, you write, you publish.",
    'gl.start_h': 'Getting started',
    'gl.rules_h': 'Guidelines',
    'gl.cta': 'Start Writing →',

    // Why contribute
    'why.eyebrow': 'For Contributors',
    'why.h1': 'Why write for Reedefined?',
    'why.intro': "Reedefined exists because magazine publishing became too generic — algorithm-chasing, ad-stuffed, written for everyone and no one. We're building the opposite: a magazine shaped entirely by the people who write it and the people who follow them. That only works if real people show up with real taste.",
    'why.paid_h': 'Is it paid?',
    'why.paid_p': "Right now, contributing is unpaid. Reedefined is early — this issue is one of our first — and we're not yet running the kind of advertising that would let us pay writers.",
    'why.note': "That's expected to change. As Reedefined grows, part of our advertising revenue is intended to go back to the contributors whose columns bring readers in. Nothing is guaranteed or scheduled yet — but revenue-sharing with contributors is a direction we're actively building toward, not an afterthought.",
    'why.now_h': 'So why write now, before that exists?',
    'why.now_p': "Because being early means shaping what this becomes. The contributors writing today are the reason Reedefined can stay niche and personal instead of turning into another feed optimized for clicks. That's rare, and it's worth something on its own — a real audience, a real byline, and a real say in what this magazine is, before it's a finished thing.",
    'why.cta': 'Start Writing →',

    // About
    'about.eyebrow': 'About',
    'about.h1': 'Why Reedefined exists',
    'about.p1': "I've always loved reading magazines, not any single one, but the specific joy each one gives you. A film column here, a way of writing about food there, someone's taste in music somewhere else entirely. I never wanted to choose just one. I wanted all of it, in one place, shaped by people rather than an algorithm.",
    'about.p2': "At the same time, we're living through the richest moment there's ever been for people sharing what they love, everyone has a playlist, a way of seeing a film, an opinion on a restaurant worth writing down. Social media gave everyone a voice, but scattered it across a hundred platforms with no real home. Reedefined is my attempt to bring that back into something that reads like a magazine again.",
    'about.p3': "I believe everyone has something worth contributing to someone else, a perspective, a taste, a way of noticing things. Put enough of those together, issue by issue, and you get something no single editor could ever plan: a genuinely valuable, genuinely different magazine, built by the people reading it.",
    'about.p4': "That's what we're building here, together.",
    'about.role': 'Founder & Editor in Chief, Reedefined',
    'about.cta': 'Meet the Contributors →',

    // Footer
        'gl.step1': 'Sign up (or upgrade your existing account) as a Contributor.',
    'gl.step2': 'Open the Contributor Portal and start a new column.',
    'gl.step3': 'Write your title, tagline, and body text — save as a draft any time.',
    'gl.step4': 'Choose a category so readers can find your writing.',
    'gl.step5': "Submit. Your column appears in the Newsstand as soon as it's published.",
    'gl.rule1': 'Write about something you genuinely care about — culture, taste, and everything in between.',
    'gl.rule2': 'Be honest. Personal opinion is welcome; plagiarism and fabricated claims are not.',
    'gl.rule3': 'No hate speech, harassment, or content that could put someone at risk.',
    'gl.rule4': 'Photos and links you include should be your own or properly credited.',
    'gl.rule5': "Keep it readable — a strong column is usually a few paragraphs, not a wall of text.",
    'pe.uploading': 'Uploading…',
    'pe.saving': 'Saving…',
    'pe.saved': 'Profile saved ✓',
'footer.rights': '© 2026 Reedefined. All rights reserved.',
  },

  tr: {
    'nav.magazine': 'Dergi',
    'nav.discover': 'Keşfet',
    'nav.illustrators': 'İllüstratörler',
    'nav.connections': 'Bağlantılar',
    'nav.write': 'Yaz',
    'nav.advertise': 'Reklam',
    'nav.signin': 'Giriş Yap',
    'nav.join': 'Kayıt Ol →',
    'nav.back': 'Stüdyoya Dön →',

    'index.eyebrow': '1. Sayı · Mayıs 2026',
    'index.h1': 'Takip ettiğin<br><em>kişilerin şekillendirdiği<br>dergi.</em>',
    'index.sub': 'Her ay kişiselleştirilmiş bir sayı — takip ettiğin yazarların köşeleri, çalma listeleri, film günlükleri ve gardıroplarından derlendi.',
    'index.join': 'Bekleme Listesine Katıl →',
    'index.read': '1. Sayıyı Oku',
    'index.how': 'Nasıl çalışır',
    'index.step1.title': 'Yazarları takip et',
    'index.step1.desc': 'Yazarlarımıza göz at. Zevkine güvendiğin sinema eleştirmenlerini, yemek yazarlarını ve moda editörlerini takip et.',
    'index.step2.title': 'Dünyalarını bağlarlar',
    'index.step2.desc': 'Yazarlar Spotify, Letterboxd, Instagram ve daha fazlasını bağlar. Gerçek hayatları köşe yazılarına dönüşür.',
    'index.step3.title': 'Sayın çıkar',
    'index.step3.desc': 'Her ayın 1\'inde kişiselleştirilmiş sayın hazır. Hiçbir okuyucu aynı dergiyi almaz.',

    'portal.signin': 'Giriş yap',
    'portal.signup': 'Hesap oluştur',
    'portal.email': 'E-posta adresi',
    'portal.password': 'Şifre',
    'portal.name': 'Ad soyad',
    'portal.role.reader': 'Okumak istiyorum',
    'portal.role.contrib': 'Yazmak istiyorum',
    'portal.forgot': 'Şifremi unuttum',
    'portal.reset': 'Sıfırlama bağlantısı gönder',
    'portal.no_account': 'Hesabın yok mu?',
    'portal.have_account': 'Zaten hesabın var mı?',
    'portal.waitlist.name': 'Adın',
    'portal.waitlist.email': 'E-posta adresi',
    'portal.waitlist.join': 'Kayıt Ol →',
    'portal.waitlist.thanks': 'Hesabın oluşturuldu. E-postanı kontrol et.',

    'newsstand.eyebrow': '1. Sayı · Mayıs 2026',
    'newsstand.welcome': 'Günaydın.',
    'newsstand.sub': 'Kişiselleştirilmiş sayın hazır.',
    'newsstand.open': 'Dergiyi Aç →',
    'newsstand.contributors': 'Yazarların',
    'newsstand.discover': 'Daha fazlasını keşfet →',
    'newsstand.following': 'Takip ediliyor',
    'newsstand.follow': 'Takip et',

    'discover.eyebrow': '1. Sayı · Mayıs 2026',
    'discover.h1': 'Kimi takip<br><em>edeceğini keşfet.</em>',
    'discover.sub': 'Reedefined yazarlarına göz at — ve beğendiğin insanların herkese açık sayılarını gör.',
    'discover.featured': 'Bu Ayın Öne Çıkanları',
    'discover.contributors': 'Yazar Editörler',
    'discover.public': 'Herkese Açık Sayılar',
    'discover.follow': 'Takip et',
    'discover.following': 'Takip ediliyor',
    'discover.search': 'Yazar, ilgi alanı, isim ara…',

    'conn.eyebrow': 'Yazar Editör',
    'conn.h1': 'Platformlarını<br><em>bağla.</em>',
    'conn.sub': 'İçeriklerini doğrudan köşene çek.',
    'conn.connected': 'bağlı',
    'conn.of': '/',
    'conn.official': 'Yalnızca resmi API\'ler — veri kazıma yok',
    'conn.never_post': 'Adına asla paylaşım yapmayız',
    'conn.connect': 'Bağla',
    'conn.coming': 'Yakında',
    'conn.pending': 'Onay Bekleniyor',
    'conn.disconnect': 'Bağlantıyı Kes',
    'conn.privacy': 'Gizlilik notu',
    'conn.privacy_text': 'Yalnızca resmi API\'ler aracılığıyla herkese açık verileri okuruz. Adına asla paylaşım, beğeni veya takip yapmayız.',

    'brief.eyebrow': 'Açık Çağrı · 2. Sayı · Haziran 2026',
    'brief.h1': 'Kapak<br>Brifing.',
    'brief.sub': '2. Sayı kapağı için bir illüstratör arıyoruz. Herkese açık.',
    'brief.submit': 'Çalışmamı Gönder →',
    'brief.submitting': 'Gönderiliyor…',

    'adv.eyebrow': 'Marka Ortaklıkları',
    'adv.h1': 'Dikkat eden<br>kişilere ulaşın.',
    'adv.sub': 'Reedefined okuyucuları kaydırmaz. Okurlar.',
    'adv.enquire': 'Reklam için İletişime Geç →',
    'adv.formats': 'Reklam Formatlarını Gör',
    'adv.send': 'Talep Gönder →',

    // Dashboard
    'dash.eyebrow': 'Panelim',
    'dash.h1': 'Yazar masan',
    'dash.published': 'Yayınlanan',
    'dash.drafts': 'Taslaklar',
    'dash.followers': 'Takipçiler',
    'dash.following': 'Takip Edilen',
    'dash.your_columns': 'Yazıların',
    'dash.write_new': 'Yeni bir tane yaz →',
    'dash.follow_h': 'Takip ettiğin kişiler',
    'dash.discover_more': 'Daha fazla keşfet →',
    'dash.empty_published': 'Henüz yayınlanan bir şey yok.',
    'dash.empty_drafts': 'Devam eden taslak yok.',
    'dash.empty_followers': 'Henüz takipçin yok.',
    'dash.empty_following': 'Henüz kimseyi takip etmiyorsun.',

    // Profile
    'profile.archive': 'Arşiv',
    'profile.empty': 'Henüz yayınlanan bir yazı yok.',

    // Profile edit
    'pe.eyebrow': 'Profilin',
    'pe.h1': 'Profilini düzenle',
    'pe.upload': 'Fotoğraf Yükle',
    'pe.hint': 'Kare fotoğraflar en iyi sonucu verir. En fazla 8MB.',
    'pe.location': 'Konum',
    'pe.location_ph': 'örn. İstanbul, Türkiye',
    'pe.bio': 'Bio',
    'pe.bio_ph': 'Kendin hakkında bir iki cümle, ne yazıyorsun, zevkin ne, geçmişin nasıl.',
    'pe.save': 'Profili Kaydet',

    // Article
    'art.flip': 'Dergi formatında oku ⇄',
    'art.back': '← Geri',
    'art.comments': 'Yorumlar',
    'art.post': 'Gönder',
    'art.sign_comment': 'Yorum yapmak için giriş yap →',
    'art.no_comments': 'Henüz yorum yok, ilk sen ol.',
    'art.add_comment': 'Bir yorum ekle…',

    // Choose screen
    'choose.welcome': 'Tekrar hoş geldin',
    'choose.h1': 'Ne yapmak istersin?',
    'choose.sub': 'Hem okuyucu hem contributorsun. Nereye gitmek istediğini seç, istediğin zaman değiştirebilirsin.',
    'choose.read_t': 'Okumak istiyorum',
    'choose.read_d': 'Kişisel sayını aç, geçmiş sayılara göz at, takip edecek yeni kişiler keşfet.',
    'choose.read_cta': 'Newsstande Git →',
    'choose.write_t': 'Katkıda bulunmak istiyorum',
    'choose.write_d': 'Yazını yaz, gönderilerini yönet, yazının nasıl gittiğini gör.',
    'choose.write_cta': 'Contributor Portala Git →',

    // Guidelines
    'gl.eyebrow': 'Contributor Bilgisi',
    'gl.h1': 'Nasıl katkıda bulunulur',
    'gl.intro': 'Reedefined tamamen okuyucuları tarafından yazılıyor. Herkes contributor olabilir, başvuru yok, sunum süreci yok. Konunu seç, yaz, yayınla.',
    'gl.start_h': 'Başlarken',
    'gl.rules_h': 'Kurallar',
    'gl.cta': 'Yazmaya Başla →',

    // Why contribute
    'why.eyebrow': 'Contributorlar İçin',
    'why.h1': 'Neden Reedefined için yazmalısın?',
    'why.intro': 'Reedefined, dergiciliğin fazla genel hale gelmesi yüzünden var, algoritma kovalayan, reklam dolu, herkes için ve kimse için yazılmayan bir hal aldı. Biz tam tersini kuruyoruz: tamamen onu yazanlar ve onları takip edenler tarafından şekillenen bir dergi. Bu ancak gerçek insanlar gerçek zevkleriyle ortaya çıkarsa işe yarıyor.',
    'why.paid_h': 'Ücretli mi?',
    'why.paid_p': 'Şu an katkı ücretsiz. Reedefined henüz çok yeni, bu sayı ilk sayılarımızdan biri, ve henüz yazarlara ödeme yapmamızı sağlayacak reklam gelirimiz yok.',
    'why.note': 'Bunun değişmesi bekleniyor. Reedefined büyüdükçe, reklam gelirinin bir kısmının okuyucu getiren contributorlara geri dönmesi hedefleniyor. Henüz hiçbir şey garanti ya da planlanmış değil, ama contributorlarla gelir paylaşımı, sonradan akla gelen bir fikir değil, aktif olarak inşa ettiğimiz bir yön.',
    'why.now_h': 'Peki bu daha yokken neden şimdi yazmalı?',
    'why.now_p': 'Çünkü erken olmak, bunun ne olacağını şekillendirmek demek. Bugün yazan contributorlar, Reedefinedın tıklama odaklı bir akışa dönüşmek yerine niş ve kişisel kalabilmesinin sebebi. Bu nadir bir şey ve tek başına bir değeri var, gerçek bir okuyucu kitlesi, gerçek bir imza, ve bu dergi bitmiş bir şey olmadan önce onun ne olacağı üzerinde gerçek bir söz hakkı.',
    'why.cta': 'Yazmaya Başla →',

    // About
    'about.eyebrow': 'Hakkımızda',
    'about.h1': 'Reedefined neden var',
    'about.p1': 'Dergi okumayı hep sevmişimdir, tek bir dergiyi değil, her birinin sana verdiği o kendine özgü keyfi. Burada bir sinema yazısı, orada yemek hakkında yazma şekli, bir başka yerde birinin müzik zevki. Hiçbir zaman sadece birini seçmek istemedim. Hepsini, tek bir yerde, bir algoritma değil insanlar tarafından şekillenmiş olarak istedim.',
    'about.p2': 'Aynı zamanda, insanların sevdiklerini paylaşması için şimdiye kadarki en zengin dönemi yaşıyoruz, herkesin bir playlisti, bir filmi görme şekli, yazılmaya değer bir restoran fikri var. Sosyal medya herkese bir ses verdi, ama bunu gerçek bir evi olmayan yüzlerce platforma dağıttı. Reedefined, bunu tekrar bir dergi gibi okunan bir şeye geri getirme çabam.',
    'about.p3': 'Herkesin başka birine katabileceği bir şey olduğuna inanıyorum, bir bakış açısı, bir zevk, bir fark ediş şekli. Bunlardan yeterince bir araya getirince, sayı sayı, tek bir editörün asla planlayamayacağı bir şey ortaya çıkıyor: gerçekten değerli, gerçekten farklı, onu okuyanlar tarafından inşa edilmiş bir dergi.',
    'about.p4': 'Burada birlikte inşa ettiğimiz şey bu.',
    'about.role': 'Kurucu & Editor in Chief, Reedefined',
    'about.cta': 'Contributorlarla Tanış →',

        'gl.step1': 'Contributor olarak kaydol (ya da mevcut hesabını yükselt).',
    'gl.step2': 'Contributor Portal\'ı aç ve yeni bir yazı başlat.',
    'gl.step3': 'Başlığını, alt başlığını ve metnini yaz, istediğin zaman taslak olarak kaydet.',
    'gl.step4': 'Okuyucuların yazını bulabilmesi için bir kategori seç.',
    'gl.step5': 'Gönder. Yazın yayınlandığı anda Newsstand\'de görünür.',
    'gl.rule1': 'Gerçekten önemsediğin bir şey hakkında yaz, kültür, zevk ve arasındaki her şey.',
    'gl.rule2': 'Dürüst ol. Kişisel görüş memnuniyetle karşılanır; intihal ve uydurma iddialar karşılanmaz.',
    'gl.rule3': 'Nefret söylemi, taciz ya da birini riske atabilecek içerik yok.',
    'gl.rule4': 'Eklediğin fotoğraf ve linkler ya senin olmalı ya da doğru şekilde kaynak gösterilmeli.',
    'gl.rule5': 'Okunabilir tut, güçlü bir yazı genelde birkaç paragraftır, uzun bir metin duvarı değil.',
    'pe.uploading': 'Yükleniyor…',
    'pe.saving': 'Kaydediliyor…',
    'pe.saved': 'Profil kaydedildi ✓',
'footer.rights': '© 2026 Reedefined. Tüm hakları saklıdır.',
  },

  de: {
    'nav.magazine': 'Das Magazin',
    'nav.discover': 'Entdecken',
    'nav.illustrators': 'Illustratoren',
    'nav.connections': 'Verbindungen',
    'nav.write': 'Schreiben',
    'nav.advertise': 'Werbung',
    'nav.signin': 'Anmelden',
    'nav.join': 'Registrieren →',
    'nav.back': 'Zurück zum Studio →',

    'index.eyebrow': 'Ausgabe Nr. 1 · Mai 2026',
    'index.h1': 'Das Magazin,<br><em>geformt von den<br>Menschen, denen du folgst.</em>',
    'index.sub': 'Jeden Monat eine personalisierte Ausgabe — zusammengestellt aus den Kolumnen, Playlists, Filmtagebüchern und Garderoben der Beitragenden, denen du folgst.',
    'index.join': 'Warteliste beitreten →',
    'index.read': 'Ausgabe Nr. 1 lesen',
    'index.how': 'So funktioniert es',
    'index.step1.title': 'Autoren folgen',
    'index.step1.desc': 'Entdecke unsere Beitragsredakteure. Folge denen, deren Geschmack du vertraust — Filmkritiker, Foodwriter, Moderedakteure.',
    'index.step2.title': 'Sie verbinden ihre Welt',
    'index.step2.desc': 'Autoren verknüpfen Spotify, Letterboxd, Instagram und mehr. Ihr echtes Leben wird zur Kolumne.',
    'index.step3.title': 'Deine Ausgabe erscheint',
    'index.step3.desc': 'Am 1. jeden Monats ist deine personalisierte Ausgabe bereit. Keine zwei Leser erhalten dasselbe Magazin.',

    'portal.signin': 'Anmelden',
    'portal.signup': 'Konto erstellen',
    'portal.email': 'E-Mail-Adresse',
    'portal.password': 'Passwort',
    'portal.name': 'Vollständiger Name',
    'portal.role.reader': 'Ich möchte lesen',
    'portal.role.contrib': 'Ich möchte beitragen',
    'portal.forgot': 'Passwort vergessen?',
    'portal.reset': 'Reset-Link senden',
    'portal.no_account': 'Noch kein Konto?',
    'portal.have_account': 'Bereits ein Konto?',
    'portal.waitlist.name': 'Dein Name',
    'portal.waitlist.email': 'E-Mail-Adresse',
    'portal.waitlist.join': 'Registrieren →',
    'portal.waitlist.thanks': 'Konto erstellt. Bitte E-Mail bestätigen.',

    'newsstand.eyebrow': 'Ausgabe Nr. 1 · Mai 2026',
    'newsstand.welcome': 'Guten Morgen.',
    'newsstand.sub': 'Deine personalisierte Ausgabe ist bereit.',
    'newsstand.open': 'Flip-Reader öffnen →',
    'newsstand.contributors': 'Deine Autoren',
    'newsstand.discover': 'Mehr entdecken →',
    'newsstand.following': 'Gefolgt',
    'newsstand.follow': 'Folgen',

    'discover.eyebrow': 'Ausgabe Nr. 1 · Mai 2026',
    'discover.h1': 'Entdecke,<br><em>wem du folgen möchtest.</em>',
    'discover.sub': 'Entdecke die Autoren von Reedefined — und sieh die öffentlichen Ausgaben von Menschen, deren Geschmack du bewunderst.',
    'discover.featured': 'Diesen Monat empfohlen',
    'discover.contributors': 'Beitragsredakteure',
    'discover.public': 'Öffentliche Ausgaben',
    'discover.follow': 'Folgen',
    'discover.following': 'Gefolgt',
    'discover.search': 'Autoren, Interessen, Namen suchen…',

    'conn.eyebrow': 'Beitragsredakteur',
    'conn.h1': 'Verbinde deine<br><em>Plattformen.</em>',
    'conn.sub': 'Ziehe deine Inhalte direkt in deine Kolumne.',
    'conn.connected': 'verbunden',
    'conn.of': 'von',
    'conn.official': 'Nur offizielle APIs — kein Scraping',
    'conn.never_post': 'Wir posten nie in deinem Namen',
    'conn.connect': 'Verbinden',
    'conn.coming': 'Demnächst',
    'conn.pending': 'Genehmigung ausstehend',
    'conn.disconnect': 'Trennen',
    'conn.privacy': 'Datenschutzhinweis',
    'conn.privacy_text': 'Wir lesen nur öffentliche Daten über offizielle APIs. Wir posten, liken oder folgen nie in deinem Namen.',

    'brief.eyebrow': 'Offener Aufruf · Ausgabe Nr. 2 · Juni 2026',
    'brief.h1': 'Cover<br>Brief.',
    'brief.sub': 'Wir suchen einen Illustrator für das Cover der 2. Ausgabe. Offen für alle.',
    'brief.submit': 'Meine Arbeit einreichen →',
    'brief.submitting': 'Wird gesendet…',

    'adv.eyebrow': 'Markenpartnerschaften',
    'adv.h1': 'Erreiche Menschen,<br>die aufmerksam sind.',
    'adv.sub': 'Reedefined-Leser scrollen nicht. Sie lesen.',
    'adv.enquire': 'Werbung anfragen →',
    'adv.formats': 'Anzeigenformate ansehen',
    'adv.send': 'Anfrage senden →',

    // Dashboard
    'dash.eyebrow': 'Mein Dashboard',
    'dash.h1': 'Dein Schreibtisch',
    'dash.published': 'Veröffentlicht',
    'dash.drafts': 'Entwürfe',
    'dash.followers': 'Follower',
    'dash.following': 'Folgt',
    'dash.your_columns': 'Deine Kolumnen',
    'dash.write_new': 'Neue schreiben →',
    'dash.follow_h': 'Contributors, denen du folgst',
    'dash.discover_more': 'Mehr entdecken →',
    'dash.empty_published': 'Noch nichts veröffentlicht.',
    'dash.empty_drafts': 'Keine Entwürfe in Arbeit.',
    'dash.empty_followers': 'Noch keine Follower.',
    'dash.empty_following': 'Du folgst noch niemandem.',

    // Profile
    'profile.archive': 'Archiv',
    'profile.empty': 'Noch keine veröffentlichten Kolumnen.',

    // Profile edit
    'pe.eyebrow': 'Dein Profil',
    'pe.h1': 'Profil bearbeiten',
    'pe.upload': 'Foto hochladen',
    'pe.hint': 'Quadratische Fotos funktionieren am besten. Max. 8MB.',
    'pe.location': 'Standort',
    'pe.location_ph': 'z.B. Istanbul, Türkei',
    'pe.bio': 'Bio',
    'pe.bio_ph': 'Ein, zwei Sätze über dich, worüber du schreibst, dein Geschmack, dein Hintergrund.',
    'pe.save': 'Profil speichern',

    // Article
    'art.flip': 'Im Magazin-Format lesen ⇄',
    'art.back': '← Zurück',
    'art.comments': 'Kommentare',
    'art.post': 'Senden',
    'art.sign_comment': 'Anmelden, um zu kommentieren →',
    'art.no_comments': 'Noch keine Kommentare, sei der Erste.',
    'art.add_comment': 'Kommentar hinzufügen…',

    // Choose screen
    'choose.welcome': 'Willkommen zurück',
    'choose.h1': 'Was möchtest du tun?',
    'choose.sub': 'Du bist Leser und Contributor zugleich. Wähle, wohin du möchtest, du kannst später jederzeit wechseln.',
    'choose.read_t': 'Ich möchte lesen',
    'choose.read_d': 'Öffne deine persönliche Ausgabe, blättere durch frühere Ausgaben und entdecke neue Leute.',
    'choose.read_cta': 'Zum Newsstand →',
    'choose.write_t': 'Ich möchte mitwirken',
    'choose.write_d': 'Schreibe deine Kolumne, verwalte deine Einreichungen und sieh, wie sie ankommt.',
    'choose.write_cta': 'Zum Contributor-Portal →',

    // Guidelines
    'gl.eyebrow': 'Contributor-Info',
    'gl.h1': 'Wie man mitwirkt',
    'gl.intro': 'Reedefined wird komplett von seinen Lesern geschrieben. Jeder kann Contributor werden, keine Bewerbung, kein Pitch-Prozess. Du wählst dein Thema, du schreibst, du veröffentlichst.',
    'gl.start_h': 'Erste Schritte',
    'gl.rules_h': 'Richtlinien',
    'gl.cta': 'Jetzt schreiben →',

    // Why contribute
    'why.eyebrow': 'Für Contributors',
    'why.h1': 'Warum für Reedefined schreiben?',
    'why.intro': 'Reedefined existiert, weil Magazine zu generisch geworden sind, algorithmusgetrieben, vollgestopft mit Werbung, geschrieben für alle und niemanden. Wir bauen das Gegenteil: ein Magazin, das komplett von den Menschen geprägt wird, die es schreiben und denen, die ihnen folgen. Das funktioniert nur, wenn echte Menschen mit echtem Geschmack mitmachen.',
    'why.paid_h': 'Wird das bezahlt?',
    'why.paid_p': 'Im Moment ist die Mitarbeit unbezahlt. Reedefined steht noch am Anfang, diese Ausgabe ist eine unserer ersten, und wir haben noch keine Werbung, mit der wir Autoren bezahlen könnten.',
    'why.note': 'Das soll sich ändern. Mit dem Wachstum von Reedefined soll ein Teil unserer Werbeeinnahmen an die Contributors zurückfließen, deren Kolumnen Leser bringen. Nichts davon ist garantiert oder terminiert, aber Umsatzbeteiligung für Contributors ist eine Richtung, auf die wir aktiv hinarbeiten, kein nachträglicher Gedanke.',
    'why.now_h': 'Warum also jetzt schreiben, bevor es das gibt?',
    'why.now_p': 'Weil früh dabei zu sein bedeutet, mitzugestalten, was daraus wird. Die Contributors, die heute schreiben, sind der Grund, warum Reedefined nischig und persönlich bleiben kann, statt zu einem weiteren klickoptimierten Feed zu werden. Das ist selten und für sich schon wertvoll, ein echtes Publikum, eine echte Signatur und ein echtes Mitspracherecht, bevor dieses Magazin fertig ist.',
    'why.cta': 'Jetzt schreiben →',

    // About
    'about.eyebrow': 'Über uns',
    'about.h1': 'Warum es Reedefined gibt',
    'about.p1': 'Ich habe es immer geliebt, Magazine zu lesen, nicht ein einzelnes, sondern die besondere Freude, die jedes einzelne gibt. Hier eine Filmkolumne, dort eine Art, über Essen zu schreiben, woanders der Musikgeschmack von jemandem. Ich wollte mich nie für nur eines entscheiden. Ich wollte alles davon, an einem Ort, geprägt von Menschen statt von einem Algorithmus.',
    'about.p2': 'Gleichzeitig erleben wir den reichsten Moment aller Zeiten dafür, dass Menschen teilen, was sie lieben, jeder hat eine Playlist, eine Art, einen Film zu sehen, eine Meinung zu einem Restaurant, die es wert ist, aufgeschrieben zu werden. Soziale Medien haben jedem eine Stimme gegeben, sie aber auf hundert Plattformen ohne echtes Zuhause verstreut. Reedefined ist mein Versuch, das wieder zu etwas zu machen, das sich wie ein Magazin liest.',
    'about.p3': 'Ich glaube, dass jeder etwas hat, das es wert ist, mit jemand anderem geteilt zu werden, eine Perspektive, einen Geschmack, eine Art, Dinge wahrzunehmen. Genug davon zusammengebracht, Ausgabe für Ausgabe, ergibt etwas, das kein einzelner Redakteur je hätte planen können: ein wirklich wertvolles, wirklich anderes Magazin, gebaut von den Menschen, die es lesen.',
    'about.p4': 'Das bauen wir hier gemeinsam auf.',
    'about.role': 'Gründerin & Chefredakteurin, Reedefined',
    'about.cta': 'Die Contributors kennenlernen →',

        'gl.step1': 'Melde dich als Contributor an (oder upgrade dein bestehendes Konto).',
    'gl.step2': 'Öffne das Contributor-Portal und starte eine neue Kolumne.',
    'gl.step3': 'Schreibe Titel, Untertitel und Text, speichere jederzeit als Entwurf.',
    'gl.step4': 'Wähle eine Kategorie, damit Leser deinen Text finden.',
    'gl.step5': 'Absenden. Deine Kolumne erscheint im Newsstand, sobald sie veröffentlicht ist.',
    'gl.rule1': 'Schreibe über etwas, das dir wirklich wichtig ist, Kultur, Geschmack und alles dazwischen.',
    'gl.rule2': 'Sei ehrlich. Persönliche Meinung ist willkommen; Plagiate und erfundene Behauptungen nicht.',
    'gl.rule3': 'Keine Hassrede, Belästigung oder Inhalte, die jemanden gefährden könnten.',
    'gl.rule4': 'Fotos und Links sollten deine eigenen sein oder korrekt mit Quelle versehen werden.',
    'gl.rule5': 'Halte es lesbar, eine gute Kolumne sind meist ein paar Absätze, keine Textwand.',
    'pe.uploading': 'Wird hochgeladen…',
    'pe.saving': 'Wird gespeichert…',
    'pe.saved': 'Profil gespeichert ✓',
'footer.rights': '© 2026 Reedefined. Alle Rechte vorbehalten.',
  }
};

// ── LANGUAGE ENGINE ──
function getLang() {
  return localStorage.getItem('rd-lang') || 'en';
}

function setLang(lang) {
  localStorage.setItem('rd-lang', lang);
  applyLang(lang);
  updateSwitcher(lang);
}

function t(key) {
  const lang = getLang();
  return TRANSLATIONS[lang]?.[key] || TRANSLATIONS['en']?.[key] || key;
}

function applyLang(lang) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = TRANSLATIONS[lang]?.[key] || TRANSLATIONS['en']?.[key];
    if (val) el.innerHTML = val;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const val = TRANSLATIONS[lang]?.[key] || TRANSLATIONS['en']?.[key];
    if (val) el.placeholder = val;
  });
}

function updateSwitcher(lang) {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    const isOn = btn.getAttribute('data-lang') === lang;
    btn.classList.toggle('on', isOn);
    btn.style.color = isOn ? '#fff' : 'rgba(255,255,255,.5)';
    btn.style.fontWeight = isOn ? '700' : '400';
  });
}

// Auto-apply on load
document.addEventListener('DOMContentLoaded', () => {
  const lang = getLang();
  applyLang(lang);
  updateSwitcher(lang);
});

// ══════════════════════════════════════════════
// NOTE: Automatic AI translation of article content (via a direct
// browser call to the Anthropic API) used to live here. It has been
// removed: it had no API key, would be blocked by the browser for
// security reasons even with one, and an API key must never be placed
// in client-side code where anyone can read and reuse it. Real content
// translation needs a small backend/serverless endpoint that holds the
// key safely — a separate project, not a client-side fix.
// The static UI translation (menus, buttons, labels) below is unaffected
// and works entirely client-side with no API calls.
// ══════════════════════════════════════════════

// ══════════════════════════════════════════════
// AUTO DATE — Issue month/year auto-updates
// Only the issue NUMBER needs manual update each month
// ══════════════════════════════════════════════

const ISSUE_NUMBER = 1; // ← Update this manually each month (1, 2, 3...)

function getCurrentIssueDate() {
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const now = new Date();
  return months[now.getMonth()] + ' ' + now.getFullYear();
}

function getIssueLabel() {
  return `Issue No. ${ISSUE_NUMBER} · ${getCurrentIssueDate()}`;
}

// Auto-fill any element with data-issue-date attribute
function applyIssueDates() {
  document.querySelectorAll('[data-issue-date]').forEach(el => {
    const format = el.getAttribute('data-issue-date');
    if (format === 'full') {
      el.textContent = getIssueLabel();
    } else if (format === 'month') {
      el.textContent = getCurrentIssueDate();
    } else if (format === 'number') {
      el.textContent = `Issue No. ${ISSUE_NUMBER}`;
    }
  });
}

document.addEventListener('DOMContentLoaded', applyIssueDates);
