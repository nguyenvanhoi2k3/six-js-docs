import type { NavGroup, NavLeaf } from "./nav-data";
import { h, Fragment } from "../../jsx";

export function renderFlatSidebar(items: NavLeaf[], heading: string): string {
  const links = items.map((item) => (
    <li>
      <a href={`#${item.slug}`} data-slug={item.slug}>
        {item.label}
      </a>
    </li>
  ));

  return (
    <>
      <p class="section-sidebar__heading">{heading}</p>
      <ul class="nav-tree nav-tree__flat">{links}</ul>
    </>
  );
}

export function renderSidebar(nav: NavGroup[], heading: string): string {
  const groups = nav.map((group) => (
    <details class="nav-tree__group" data-group={group.slug}>
      <summary>{group.label}</summary>
      <ul class="nav-tree__children">
        {group.items.map((item) => (
          <li>
            <a href={`#${group.slug}/${item.slug}`} data-slug={`${group.slug}/${item.slug}`}>
              {item.label}
              {item.badge ? <span class="badge"> {item.badge}</span> : ""}
            </a>
          </li>
        ))}
      </ul>
    </details>
  ));

  return (
    <>
      <p class="section-sidebar__heading">{heading}</p>
      <nav class="nav-tree">{groups}</nav>
    </>
  );
}
