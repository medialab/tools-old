from jinja2 import Environment, FileSystemLoader
import os
import json

def render_tools(path, env, toolnames):
    res = []
    for toolname in toolnames:
        res.append(render_tool(path, env, toolname))
    return zip(toolnames, res)

def render_tool(path, env, toolname):
    template = env.get_template("details.html")

    with open(os.path.join(path, toolname, "meta.json")) as meta:
        data = json.load(meta)
    data["name"] = toolname

    return template.render(**data)

def render_index(path, env, index_list):
    template = env.get_template("index.html")

    return template.render(**index_list)

def get_index_list(list_file):
    return json.load(list_file)

if __name__ == "__main__":
    import sys
    env = Environment(loader=FileSystemLoader(os.path.join(sys.argv[1], "source", "templates")))

    with open(os.path.join(sys.argv[1], "source", "index.json")) as list_file:
        index_list = get_index_list(list_file)

    print "#" * 10
    print "index"
    print "-" * 10
    print render_index(sys.argv[1], env, index_list)

    tool_list = [index_list["tool1"], index_list["tool2"], index_list["tool3"]]
    tool_list += index_list["tools4"]
    for name, t in render_tools(sys.argv[1], env, tool_list):
        print "#" * 10
        print name
        print "-" * 10
        print t
