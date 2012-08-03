from jinja2 import Environment, FileSystemLoader

def prepare_list_data(list_file):
    index_list = json.load(list_file)

    element_list = [index_list["element1"], index_list["element2"], index_list["element3"]]
    element_list += index_list["elements4"]

    return (index_list, element_list)

def gather_element_data(element_meta_file, index_data, idx):
    element_data = json.load(element_meta_file)
    element_data["id"] = elementname
    element_data["title"] = element_data["name"]

    if idx < 4:
        index_data["element"+`idx`] = element_data
    else:
        index_data["elements4"][idx-4] = element_data

    return (element_data, index_data)

def render_template(env, template, data, output_file):
    template = env.get_template(template+".html")

    return output_file.write(template.render(**data))

if __name__ == "__main__":
    import os, sys, json

    webdir = sys.argv[1]
    env = Environment(loader=FileSystemLoader(os.path.join(webdir, "source", "templates")))

    with open(os.path.join(webdir, "source", "index.json")) as list_file:
        index_data, element_list = prepare_list_data(list_file)

    for i, elementname in enumerate(element_list):
        with open(os.path.join(webdir, elementname, "meta.json")) as meta:
            (data, index_data) = gather_element_data(meta, index_data, i+1)

        with open(os.path.join(webdir, elementname+".html"), "w") as element_html:
            render_template(env, 'details', data, element_html)

    with open(os.path.join(webdir, "index.html"), "w") as index_html:
        render_template(env, 'index', index_data, index_html)

