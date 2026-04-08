import { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { feedbackAPI } from '../../api/services';

export default function FeedbackSection() {
  const { t } = useTranslation();
  const [feedbackType, setFeedbackType] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleFeedbackTypeClick = (type) => {
    setFeedbackType(type);
  };

  const handleFeedbackSubmit = async () => {
    if (!feedbackMessage.trim()) {
      alert(t('feedbackPlaceholder'));
      return;
    }
    try {
      setFeedbackSubmitting(true);
      const response = await feedbackAPI.submit({
        feedbackType,
        message: feedbackMessage,
        pageUrl: window.location.href,
      });
      
      if (response.data && response.data.status === 'success') {
        setFeedbackSubmitted(true);
      } else {
        alert('Failed to send feedback. Please try again.');
      }
    } catch (error) {
      console.error('Feedback error:', error);
      alert('Something went wrong. Please try again later.');
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  return (
    <section className="bg-white py-10 px-8">
      <div className="max-w-[1200px] mx-auto p-6 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-base font-semibold text-gray-900 mb-1">{t('feedbackQuestion')}</p>
            <p className="text-sm text-gray-600">{t('feedbackDesc')}</p>
          </div>
          <div className="flex items-center gap-3">
            {!feedbackSubmitted ? (
              !feedbackType ? (
                <>
                  <button
                    className="btn-glow btn-glow-sm flex items-center gap-2"
                    onClick={() => handleFeedbackTypeClick('like')}
                  >
                    {t('feedbackYes')} <ThumbsUp size={15} />
                  </button>
                  <button
                    className="btn-glow btn-glow-sm flex items-center gap-2"
                    onClick={() => handleFeedbackTypeClick('dislike')}
                  >
                    {t('feedbackNo')} <ThumbsDown size={15} />
                  </button>
                </>
              ) : null
            ) : (
              <p className="text-sm font-medium text-purple">
                {feedbackType === 'like' ? t('feedbackPositive') : t('feedbackNegative')}
              </p>
            )}
          </div>
        </div>
        {feedbackType && !feedbackSubmitted && (
          <div className="mt-4">
            <textarea
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-gray-400 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.06)] resize-none"
              placeholder={t('feedbackPlaceholder')}
              rows="2"
              value={feedbackMessage}
              onChange={(e) => setFeedbackMessage(e.target.value)}
            />
            <div className="flex gap-3 mt-3">
              <button
                className="btn-glow btn-glow-sm"
                onClick={handleFeedbackSubmit}
                disabled={feedbackSubmitting}
              >
                {feedbackSubmitting ? t('feedbackSubmitting') : t('submitFeedback')}
              </button>
              <button
                className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-full text-sm font-semibold cursor-pointer transition-all duration-200 hover:bg-gray-50"
                onClick={() => { setFeedbackType(null); setFeedbackMessage(''); }}
                disabled={feedbackSubmitting}
              >
                {t('cancelFeedback')}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
