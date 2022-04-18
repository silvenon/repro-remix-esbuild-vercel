import { useRef } from 'react'
import { json } from '@remix-run/node'
import type { ActionFunction } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { Tab } from '@headlessui/react'
import { transform } from '~/utils/transform.server'
import invariant from 'tiny-invariant'
import clsx from 'clsx'

export const action: ActionFunction = async ({ request }) => {
  const data = await request.formData()
  const source = data.get('source')
  invariant(typeof source === 'string', 'source is required')
  if ( source === '') return json({ code: '' })
  const result = await transform(source, {
    loader: 'ts',
    format: 'iife',
    minify: true,
  })
  return json({ code: result.code })
}

export default function Index() {
  const fetcher = useFetcher()
  const formRef = useRef(null)
  return (
    <fetcher.Form ref={formRef} className="mx-auto p-4 prose" method="post">
      <Tab.Group onChange={(index) => {
        if (index === 1) {
          fetcher.submit(formRef.current)
        }
      }}>
        {({ selectedIndex }) => (
          <>
            <Tab.List className="flex items-center">
              <Tab
                className={({ selected }) =>
                  clsx(
                    selected
                      ? 'text-gray-900 bg-gray-100 hover:bg-gray-200'
                      : 'text-gray-500 hover:text-gray-900 bg-white hover:bg-gray-100',
                    'px-3 py-1.5 border border-transparent text-sm font-medium rounded-md'
                  )
                }
              >
                Source
              </Tab>
              <Tab
                className={({ selected }) =>
                  clsx(
                    selected
                      ? 'text-gray-900 bg-gray-100 hover:bg-gray-200'
                      : 'text-gray-500 hover:text-gray-900 bg-white hover:bg-gray-100',
                    'ml-2 px-3 py-1.5 border border-transparent text-sm font-medium rounded-md'
                  )
                }
              >
                Bundled
              </Tab>
            </Tab.List>
            <Tab.Panels className="mt-2">
              <Tab.Panel className="p-0.5 -m-0.5 rounded-lg">
                <label htmlFor="source" className="sr-only">
                  Source
                </label>
                <div>
                  <textarea
                    rows={5}
                    name="source"
                    id="source"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm font-mono border-gray-300 rounded-md"
                    placeholder="Add source code..."
                  />
                </div>
              </Tab.Panel>
              <Tab.Panel className="p-0.5 -m-0.5 rounded-lg">
                <div className="border-b">
                  <div className="mx-px mt-px px-3 pt-2 pb-12 text-sm leading-5 text-gray-800 font-mono">
                    {fetcher.data && fetcher.data.code ? fetcher.data.code : 'Minified code will appear here...'}
                  </div>
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </>
        )}
      </Tab.Group>
    </fetcher.Form>
  );
}
