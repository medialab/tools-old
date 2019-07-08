from flask import render_template, send_from_directory, abort
from FlaskTools import config, application as app
from config import SOURCE_FOLDER, DATA_FOLDER
import os, re, glob, markdown, json, codecs
from docutils import core as rst2html

def gather_element_data(elementname, element_meta_file):
    try:
        element_data = json.load(element_meta_file)
    except:
        element_data = {'name': "%s (error with meta.json)" % elementname}
    result = {}
    result["id"] = elementname
    result["title"] = element_data["name"]
    for key, value in element_data.iteritems():
        if value:
            if key == "visual" and not value.startswith("http"):
                value = "%s/%s" % (elementname, value)
            result[key] = value
    doc = find_readme(os.path.join(DATA_FOLDER, elementname), element_data['source'])
    if doc is not None:
        result["readme_html"] = doc
    return result

re_rel_links = re.compile(r'(\[[^]]+\]\()([^)]+)\)')
clean_rel_links = lambda md, source: re_rel_links.sub(lambda x: '%s%s)' % (x.group(1), (x.group(2) if x.group(2).lower().startswith('http') else '%s/blob/master/%s' % (source.strip('/'), x.group(2).strip('/')))), md)
def find_readme(folder, source):
    matches = glob.glob(os.path.join(folder, "[rR][eE][aA][dD][mM][eE]*.[mM][dD]")) + glob.glob(os.path.join(folder, "[rR][eE][aA][dD][mM][eE]*.[rR][sS][tT]"))
    if len(matches) > 0:
        try:
            with codecs.open(matches[0], mode="r", encoding="utf-8") as readme:
                text = readme.read()
                text = clean_rel_links(text, source)
                if readme.name.lower().endswith("md"):
                    return markdown.markdown(text, extensions=["markdown.extensions.fenced_code"])
                else:
                    html = rst2html.publish_string(source=text, writer_name='html')
                    return html[html.find('<body>')+6:html.find('</body>')].strip().decode('utf-8')
        except:
            return None
    return None

@app.route("/")
@app.route("/index.html")
@app.route("/index.htm")
def index():
    with open(os.path.join(SOURCE_FOLDER, "index.json")) as list_file:
        index_list = json.load(list_file)
    index_data = {"sidebar": []}
    for i in (1,2,3):
        if "element%s" % i in index_list:
            elementname = index_list["element%s" % i]
            try:
                with codecs.open(os.path.join(DATA_FOLDER, elementname, "meta.json"), mode="r", encoding="utf-8") as meta:
                    index_data["element"+str(i)] = gather_element_data(elementname, meta)
                    index_data["sidebar"].append(index_data["element"+str(i)])
            except: pass
    if "elements4" in index_list:
        index_data["elements4"] = []
        for i, elementname in enumerate(index_list["elements4"]):
            try:
                with codecs.open(os.path.join(DATA_FOLDER, elementname, "meta.json"), mode="r", encoding="utf-8") as meta:
                    index_data["elements4"].append(gather_element_data(elementname, meta))
                    index_data["sidebar"].append(index_data["elements4"][-1])
            except: pass
    if "moreelements" in index_list:
        index_data["moreelements"] = []
        for section in index_list["moreelements"]:
            idxsection = {
                "name": section["name"],
                "elements": []
            }
            try:
                for i, elementname in enumerate(section["elements"]):
                    with codecs.open(os.path.join(DATA_FOLDER, elementname, "meta.json"), mode="r", encoding="utf-8") as meta:
                        idxsection["elements"].append(gather_element_data(elementname, meta))
                        index_data["sidebar"].append(idxsection["elements"][-1])
            except: pass
            index_data["moreelements"].append(idxsection)
    if "otherelements" in index_list:
        index_data["otherelements"] = []
        for i, elementname in enumerate(index_list["otherelements"]):
            try:
                with codecs.open(os.path.join(DATA_FOLDER, elementname, "meta.json"), mode="r", encoding="utf-8") as meta:
                    index_data["otherelements"].append(gather_element_data(elementname, meta))
            except: pass

    return render_template("index.html", **index_data)

@app.route("/<elementname>.html")
def element(elementname):
    with codecs.open(os.path.join(DATA_FOLDER, elementname, "meta.json"), mode="r", encoding="utf-8") as meta:
        data = gather_element_data(elementname, meta)
        return render_template("details.html", **data)

@app.route("/media/<path:path>")
def filesystem(path):
    try:
        return send_from_directory('media', path)
    except Exception as e:
        print type(e), e, os.getcwd(), os.path.join(directory, filename)
        abort(403)
