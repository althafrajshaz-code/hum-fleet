const fs = require('fs');
let content = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

// 1. Inject the state variable
if (!content.includes('const [showRatingStep2, setShowRatingStep2] = useState(false);')) {
    content = content.replace(
        "const [ratingComment, setRatingComment] = useState('');",
        "const [ratingComment, setRatingComment] = useState('');\n  const [showRatingStep2, setShowRatingStep2] = useState(false);"
    );
}

// 2. Modify the submit handler handleDismissRating to reset step2
if (!content.includes('setShowRatingStep2(false);') && content.includes('const handleDismissRating = async () => {')) {
    content = content.replace(
        "const handleDismissRating = async () => {",
        "const handleDismissRating = async () => {\n    setShowRatingStep2(false);"
    );
}

// 3. Update the Rating Panel JSX
let ratingStart = `                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', color: '#10b981' }}>`;
let ratingEndStr = `                  </Button>
                </div>
              )}`;

let startIdx = content.indexOf(ratingStart);
if (startIdx !== -1) {
    let endIdx = content.indexOf(ratingEndStr, startIdx);
    if (endIdx !== -1) {
        endIdx += ratingEndStr.length - 17; // Target just before the close of the modal
        
        let oldBlock = content.substring(startIdx, endIdx);
        
        let feedbackStartIdx = oldBlock.indexOf(`<div style={{ padding: '14px', border: '1px solid var(--border)'`);
        if (feedbackStartIdx !== -1) {
            let cashBlock = oldBlock.substring(0, feedbackStartIdx);
            let feedbackBlock = oldBlock.substring(feedbackStartIdx);
            
            let newSubmitBtn = `<div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                        <Button variant="outline" className="full-width" onClick={() => setShowRatingStep2(false)} style={{ borderColor: 'var(--text-muted)', color: 'var(--text-muted)', padding: '16px', fontSize: '18px', fontWeight: '900', borderRadius: '12px' }}>
                          Back
                        </Button>
                        <Button variant="primary" className="full-width" onClick={handleDismissRating} style={{ background: '#10b981', color: 'white', padding: '16px', fontSize: '18px', fontWeight: '900', borderRadius: '12px' }}>
                          Submit & Finish
                        </Button>
                      </div>`;
            
            feedbackBlock = feedbackBlock.replace(/<Button variant="primary" className="full-width" onClick=\{handleDismissRating\}[^>]*>[\s\S]*?<\/Button>/, newSubmitBtn);
            
            let newBlock = `                  {!showRatingStep2 ? (
                    <>
${cashBlock}
                      <Button variant="primary" className="full-width" onClick={() => setShowRatingStep2(true)} style={{ background: '#3b82f6', color: 'white', padding: '16px', fontSize: '18px', fontWeight: '900', borderRadius: '12px' }}>
                        Next: Rate Passenger
                      </Button>
                    </>
                  ) : (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', color: '#3b82f6', marginBottom: '8px' }}>
                        <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '900' }}>Rate Passenger</h3>
                      </div>
${feedbackBlock}
                    </>
                  )}`;
                  
            content = content.substring(0, startIdx) + newBlock + content.substring(endIdx);
        }
    }
}

fs.writeFileSync('src/pages/DriverDashboard.jsx', content);
