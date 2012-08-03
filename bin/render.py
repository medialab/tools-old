# -*- coding: utf-8 -*-
from jinja2 import Environment, FileSystemLoader
import os, glob, markdown
from docutils import core as rst2html

def prepare_list_data(list_file):
    index_list = json.load(list_file)

    element_list = [index_list["element1"], index_list["element2"], index_list["element3"]]
    element_list += index_list["elements4"]

    return (index_list, element_list)

def gather_element_data(element_meta_file, index_data, idx, doc=None):
    element_data = json.load(element_meta_file)
    element_data["id"] = elementname
    element_data["title"] = element_data["name"]

    if idx < 4:
        index_data["element"+`idx`] = element_data
    else:
        index_data["elements4"][idx-4] = element_data

    if doc is not None:
        text = doc.read()
        if doc.name.lower().endswith("md"):
            element_data["doc"] = markdown.markdown(text)
        else:
            html = rst2html.publish_string(source=text, writer_name='html')
            element_data["doc"] = html[html.find('<body>')+6:html.find('</body>')].strip().decode('utf-8')

    return (element_data, index_data)

def find_readme(folder):
    matches = glob.glob(os.path.join(folder, "[rR][eE][aA][dD][mM][eE]*.[mM][dD]")) + glob.glob(os.path.join(folder, "[rR][eE][aA][dD][mM][eE]*.[rR][sS][tT]"))
    if len(matches) > 0:
        return matches[0]
    return None

def render_template(env, template, data, output_file):
    template = env.get_template(template+".html")

    return output_file.write(template.render(**data))

if __name__ == "__main__":
    import sys, json, codecs

    webdir = sys.argv[1]
    env = Environment(loader=FileSystemLoader(os.path.join(webdir, "source", "templates")))

    with open(os.path.join(webdir, "source", "index.json")) as list_file:
        index_data, element_list = prepare_list_data(list_file)

    for i, elementname in enumerate(element_list):
        with codecs.open(os.path.join(webdir, elementname, "meta.json"), mode="r", encoding="utf-8") as meta:
            doc = find_readme(os.path.join(webdir, elementname))
            if doc is not None:
                with codecs.open(doc, mode="r", encoding="utf-8") as readme:
                    (data, index_data) = gather_element_data(meta, index_data, i+1, readme)
            else:
                (data, index_data) = gather_element_data(meta, index_data, i+1)

        with codecs.open(os.path.join(webdir, elementname+".html"), mode="w", encoding="utf-8") as element_html:
            render_template(env, 'details', data, element_html)

    with codecs.open(os.path.join(webdir, "index.html"), mode="w", encoding="utf-8") as index_html:
        render_template(env, 'index', index_data, index_html)

