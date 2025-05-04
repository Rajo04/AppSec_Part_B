import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

const Language: React.FC = () => {
    const router = useRouter();
    const { locale, pathname, asPath, query } = router;

    const { t } = useTranslation();

    const handleLanguageChange = (event: { target: { value: string } }) => {
        const newLocale = event.target.value;
        const { pathname, asPath, query } = router;
        router.push({ pathname, query }, asPath, { locale: newLocale });
    };

    return (
        <div className="ml-6">
            <select
                id="language"
                name="language"
                className="bg-accent hover:shadow-lg hover:shadow-neutral-400 rounded-lg block w-full px-3 py-2 border border-accent placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm appearance-none"
                value={locale}
                onChange={handleLanguageChange}
            >
                <option value="" disabled selected>{t('language.language')}</option>
                <option value="en">{t('language.english')}</option>
                <option value="nl">{t('language.dutch')}</option>
            </select>
        </div>
    );
};

export default Language;