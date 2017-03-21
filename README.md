# Tag-Labeling-on-Img-from-dragNdrop

**How to start:**
1) Clone repository ( ```git clone https://github.com/levadadenys/Tag-Labeling-on-Img-from-dragNdrop.git``` )
2) Open repository directory and instal npm packages ( ```npm install```), wait `till all the packages will be installed.
3) Go to public directory and open up ```index.html```
4) Just drag and drop or open any img file and start adding tags(by clicking on img) (if you don`t have any img, you can use ```imgExample.png``` from ```public directory```)


If you want to see code and documentation: go to ```src``` directory and open ```app.jsx``` file


---------------------------------------------------------------------
**Technologies**
- JavaScript (using React JS+ Redux)
- HTML5
- CSS3
- Pixel perfect
- Using webpack as a build system

**List of functions:**
• Drag and drop upload of an image
• Tap/click on image to put a tag
• Enter a note for each tag
• List of notes
• Highlight tag when note selected
• Highlight note when tag clicked

**List of blocks:**
Left Menu - is a dummy component which should allow to change selected element.
Header - only actionable area is a file uploading component. Search input and Log in button are dummy plugs.
Image Area - if image is uploaded to a page it should become clickable. Upon click on the image user should see a pop-up with a textarea where he can enter some text. Pop-up has to options: Ok, Cancel. If user cancels this action, then pop-up should disappear. In case of Ok action, tag should appear in place of original click on the image and note should be added to list of notes. At this moment just added tag and note should become highlighted. Later on by clicking on tags related note should become highlighted.
List of Notes - that is a plain list of notes added to an image. By selecting a note related tag should
become highlighted. Toggle on the top of a list (Latest vs All) is a dummy plug.
General comment: in case of uploading of new image, all tags and notes should be removed.