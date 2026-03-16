# Nozapp Project Bundle for AI Analysis

This document contains the core files of the Nozapp project for context and analysis.

## Project Structure (Core)
```text
./
    .cursorrules.md
    nozapp_project_bundle.md
    next-env.d.ts
    README.md
    tailwind.config.ts
    paper.md
    nozapp_report.md
    dataset/
        output/
        __pycache__/
        .venv/
            bin/
            include/
            lib/
                python3.14/
                    site-packages/
                        anyio-4.12.1.dist-info/
                            licenses/
                        jwt/
                            __pycache__/
                        strictyaml-1.7.3.dist-info/
                        mdurl/
                            __pycache__/
                        packaging/
                            licenses/
                                __pycache__/
                            __pycache__/
                        requests-2.32.5.dist-info/
                            licenses/
                        httpcore/
                            _backends/
                                __pycache__/
                            _async/
                                __pycache__/
                            __pycache__/
                            _sync/
                                __pycache__/
                        multidict-6.7.1.dist-info/
                            licenses/
                        hive_metastore/
                            __pycache__/
                        click-8.3.1.dist-info/
                            licenses/
                        h11/
                            __pycache__/
                        certifi-2026.2.25.dist-info/
                            licenses/
                        supabase_auth-2.28.0.dist-info/
                        dotenv/
                            __pycache__/
                        annotated_types/
                            __pycache__/
                        h2/
                            __pycache__/
                        hpack/
                            __pycache__/
                        pygments/
                            filters/
                                __pycache__/
                            lexers/
                                __pycache__/
                            formatters/
                                __pycache__/
                            __pycache__/
                            styles/
                                __pycache__/
                        strenum/
                            __pycache__/
                        pycparser/
                            __pycache__/
                        propcache/
                            __pycache__/
                        pydantic-2.12.5.dist-info/
                            licenses/
                        mmh3/
                        pyparsing/
                            tools/
                                __pycache__/
                            diagram/
                                __pycache__/
                            __pycache__/
                            ai/
                                best_practices.md
                                __pycache__/
                                show_best_practices/
                                    __pycache__/
                        propcache-0.4.1.dist-info/
                            licenses/
                        cryptography/
                            hazmat/
                                asn1/
                                    __pycache__/
                                decrepit/
                                    __pycache__/
                                    ciphers/
                                        __pycache__/
                                backends/
                                    __pycache__/
                                    openssl/
                                        __pycache__/
                                __pycache__/
                                primitives/
                                    kdf/
                                        __pycache__/
                                    twofactor/
                                        __pycache__/
                                    serialization/
                                        __pycache__/
                                    __pycache__/
                                    ciphers/
                                        __pycache__/
                                    asymmetric/
                                        __pycache__/
                                bindings/
                                    _rust/
                                        openssl/
                                    __pycache__/
                                    openssl/
                                        __pycache__/
                            __pycache__/
                            x509/
                                __pycache__/
                        supabase_functions/
                            _async/
                                __pycache__/
                            __pycache__/
                            _sync/
                                __pycache__/
                        strictyaml/
                            __pycache__/
                            ruamel/
                                __pycache__/
                        fsspec/
                            tests/
                                abstract/
                                    __pycache__/
                            __pycache__/
                            implementations/
                                __pycache__/
                        fsspec-2026.2.0.dist-info/
                            licenses/
                        yarl-1.23.0.dist-info/
                            licenses/
                        cffi/
                            __pycache__/
                        postgrest/
                            _async/
                                __pycache__/
                            __pycache__/
                            _sync/
                                __pycache__/
                        idna-3.11.dist-info/
                            licenses/
                                LICENSE.md
                        markdown_it/
                            rules_block/
                                __pycache__/
                            rules_core/
                                __pycache__/
                            __pycache__/
                            cli/
                                __pycache__/
                            common/
                                __pycache__/
                            rules_inline/
                                __pycache__/
                            presets/
                                __pycache__/
                            helpers/
                                __pycache__/
                        cffi-2.0.0.dist-info/
                            licenses/
                        supabase_functions-2.28.0.dist-info/
                        zstandard-0.25.0.dist-info/
                            licenses/
                        supabase_auth/
                            _async/
                                __pycache__/
                            __pycache__/
                            _sync/
                                __pycache__/
                        idna/
                            __pycache__/
                        rich-14.3.3.dist-info/
                            licenses/
                        click/
                            __pycache__/
                        tenacity/
                            __pycache__/
                            asyncio/
                                __pycache__/
                        hyperframe/
                            __pycache__/
                        tenacity-9.1.4.dist-info/
                            licenses/
                        websockets/
                            legacy/
                                __pycache__/
                            __pycache__/
                            extensions/
                                __pycache__/
                            sync/
                                __pycache__/
                            asyncio/
                                __pycache__/
                        psycopg2_binary-2.9.11.dist-info/
                            licenses/
                        httpcore-1.0.9.dist-info/
                            licenses/
                                LICENSE.md
                        mmh3-5.2.0.dist-info/
                            licenses/
                        __pycache__/
                        cachetools/
                            __pycache__/
                        charset_normalizer-3.4.4.dist-info/
                            licenses/
                        StrEnum-0.4.15.dist-info/
                        markdown_it_py-4.0.0.dist-info/
                            licenses/
                        realtime-2.28.0.dist-info/
                        charset_normalizer/
                            __pycache__/
                            cli/
                                __pycache__/
                        supabase/
                            _async/
                                __pycache__/
                            __pycache__/
                            lib/
                                __pycache__/
                            _sync/
                                __pycache__/
                        requests/
                            __pycache__/
                        pyjwt-2.11.0.dist-info/
                            licenses/
                        storage3/
                            _async/
                                __pycache__/
                            __pycache__/
                            _sync/
                                __pycache__/
                        realtime/
                            _async/
                                __pycache__/
                            __pycache__/
                            _sync/
                                __pycache__/
                        multidict/
                            __pycache__/
                        anyio/
                            abc/
                                __pycache__/
                            _backends/
                                __pycache__/
                            _core/
                                __pycache__/
                            streams/
                                __pycache__/
                            __pycache__/
                        postgrest-2.28.0.dist-info/
                        pip/
                            _internal/
                                network/
                                    __pycache__/
                                utils/
                                    __pycache__/
                                models/
                                    __pycache__/
                                __pycache__/
                                cli/
                                    __pycache__/
                                operations/
                                    install/
                                        __pycache__/
                                    __pycache__/
                                    build/
                                        __pycache__/
                                req/
                                    __pycache__/
                                resolution/
                                    legacy/
                                        __pycache__/
                                    __pycache__/
                                    resolvelib/
                                        __pycache__/
                                vcs/
                                    __pycache__/
                                locations/
                                    __pycache__/
                                index/
                                    __pycache__/
                                commands/
                                    __pycache__/
                                metadata/
                                    __pycache__/
                                    importlib/
                                        __pycache__/
                                distributions/
                                    __pycache__/
                            _vendor/
                                packaging/
                                    licenses/
                                        __pycache__/
                                    __pycache__/
                                truststore/
                                    __pycache__/
                                msgpack/
                                    __pycache__/
                                dependency_groups/
                                    __pycache__/
                                pygments/
                                    filters/
                                        __pycache__/
                                    lexers/
                                        __pycache__/
                                    formatters/
                                        __pycache__/
                                    __pycache__/
                                    styles/
                                        __pycache__/
                                distlib/
                                    __pycache__/
                                distro/
                                    __pycache__/
                                cachecontrol/
                                    __pycache__/
                                    caches/
                                        __pycache__/
                                idna/
                                    LICENSE.md
                                    __pycache__/
                                __pycache__/
                                requests/
                                    __pycache__/
                                tomli/
                                    __pycache__/
                                certifi/
                                    __pycache__/
                                pyproject_hooks/
                                    __pycache__/
                                    _in_process/
                                        __pycache__/
                                rich/
                                    __pycache__/
                                tomli_w/
                                    __pycache__/
                                urllib3/
                                    util/
                                        __pycache__/
                                    __pycache__/
                                    contrib/
                                        __pycache__/
                                        _securetransport/
                                            __pycache__/
                                    packages/
                                        __pycache__/
                                        backports/
                                            __pycache__/
                                pkg_resources/
                                    __pycache__/
                                resolvelib/
                                    __pycache__/
                                    resolvers/
                                        __pycache__/
                                platformdirs/
                                    __pycache__/
                            __pycache__/
                        python_dotenv-1.2.2.dist-info/
                            licenses/
                        h11-0.16.0.dist-info/
                            licenses/
                        pycparser-3.0.dist-info/
                            licenses/
                        httpx/
                            _transports/
                                __pycache__/
                            __pycache__/
                        cachetools-6.2.6.dist-info/
                            licenses/
                        certifi/
                            __pycache__/
                        mdurl-0.1.2.dist-info/
                        python_dateutil-2.9.0.post0.dist-info/
                        pyiceberg/
                            catalog/
                                __pycache__/
                                rest/
                                    __pycache__/
                            io/
                                __pycache__/
                            utils/
                                __pycache__/
                            __pycache__/
                            cli/
                                __pycache__/
                            avro/
                                codecs/
                                    __pycache__/
                                __pycache__/
                            table/
                                update/
                                    __pycache__/
                                __pycache__/
                            expressions/
                                __pycache__/
                        supabase-2.28.0.dist-info/
                            licenses/
                        pydantic_core-2.41.5.dist-info/
                            licenses/
                        urllib3-2.6.3.dist-info/
                            licenses/
                        pyiceberg-0.11.1.dist-info/
                            licenses/
                        typing_extensions-4.15.0.dist-info/
                            licenses/
                        rich/
                            _unicode_data/
                                __pycache__/
                            __pycache__/
                        pyparsing-3.3.2.dist-info/
                            licenses/
                        storage3-2.28.0.dist-info/
                        pyroaring-1.0.3.dist-info/
                            licenses/
                        deprecation-2.1.0.dist-info/
                        urllib3/
                            util/
                                __pycache__/
                            __pycache__/
                            contrib/
                                __pycache__/
                                emscripten/
                                    __pycache__/
                            http2/
                                __pycache__/
                        pygments-2.19.2.dist-info/
                            licenses/
                        websockets-15.0.1.dist-info/
                        packaging-26.0.dist-info/
                            licenses/
                        httpx-0.28.1.dist-info/
                            licenses/
                                LICENSE.md
                        h2-4.3.0.dist-info/
                            licenses/
                        psycopg2/
                            __pycache__/
                            .dylibs/
                        pydantic/
                            v1/
                                __pycache__/
                            _internal/
                                __pycache__/
                            experimental/
                                __pycache__/
                            plugin/
                                __pycache__/
                            __pycache__/
                            deprecated/
                                __pycache__/
                        hpack-4.1.0.dist-info/
                        typing_inspection/
                            __pycache__/
                        zstandard/
                            __pycache__/
                        typing_inspection-0.4.2.dist-info/
                            licenses/
                        yarl/
                            __pycache__/
                        annotated_types-0.7.0.dist-info/
                            licenses/
                        fb303/
                            __pycache__/
                        cryptography-46.0.5.dist-info/
                            licenses/
                        pydantic_core/
                            __pycache__/
                        six-1.17.0.dist-info/
                        hyperframe-6.1.0.dist-info/
                        dateutil/
                            zoneinfo/
                                __pycache__/
                            __pycache__/
                            parser/
                                __pycache__/
                            tz/
                                __pycache__/
                        pyroaring/
                        pip-26.0.dist-info/
                            licenses/
                                src/
                                    pip/
                                        _vendor/
                                            packaging/
                                            truststore/
                                            msgpack/
                                            dependency_groups/
                                            pygments/
                                            distlib/
                                            distro/
                                            cachecontrol/
                                            idna/
                                                LICENSE.md
                                            requests/
                                            tomli/
                                            certifi/
                                            pyproject_hooks/
                                            rich/
                                            tomli_w/
                                            urllib3/
                                            pkg_resources/
                                            resolvelib/
                                            platformdirs/
    docs/
        architecture.md
        dataset.md
        todo.md
        style.md
        approccio.md
        rules.md
    supabase/
        migrations/
        .temp/
    public/
    sandbox/
        button-test/
            test/
            utils/
        data-visualizzation/
            test/
            utils/
                relation.md
        onboarding/
            test/
            utils/
                relation.md
    scripts/
        title-conversion/
            readme.md
            venv/
                bin/
                include/
                lib/
                    python3.14/
                        site-packages/
                            rapidfuzz-3.14.3.dist-info/
                                licenses/
                            pip/
                                _internal/
                                    network/
                                        __pycache__/
                                    utils/
                                        __pycache__/
                                    models/
                                        __pycache__/
                                    __pycache__/
                                    cli/
                                        __pycache__/
                                    operations/
                                        install/
                                            __pycache__/
                                        __pycache__/
                                        build/
                                            __pycache__/
                                    req/
                                        __pycache__/
                                    resolution/
                                        legacy/
                                            __pycache__/
                                        __pycache__/
                                        resolvelib/
                                            __pycache__/
                                    vcs/
                                        __pycache__/
                                    locations/
                                        __pycache__/
                                    index/
                                        __pycache__/
                                    commands/
                                        __pycache__/
                                    metadata/
                                        __pycache__/
                                        importlib/
                                            __pycache__/
                                    distributions/
                                        __pycache__/
                                _vendor/
                                    packaging/
                                        licenses/
                                            __pycache__/
                                        __pycache__/
                                    truststore/
                                        __pycache__/
                                    msgpack/
                                        __pycache__/
                                    dependency_groups/
                                        __pycache__/
                                    pygments/
                                        filters/
                                            __pycache__/
                                        lexers/
                                            __pycache__/
                                        formatters/
                                            __pycache__/
                                        __pycache__/
                                        styles/
                                            __pycache__/
                                    distlib/
                                        __pycache__/
                                    distro/
                                        __pycache__/
                                    cachecontrol/
                                        __pycache__/
                                        caches/
                                            __pycache__/
                                    idna/
                                        LICENSE.md
                                        __pycache__/
                                    __pycache__/
                                    requests/
                                        __pycache__/
                                    tomli/
                                        __pycache__/
                                    certifi/
                                        __pycache__/
                                    pyproject_hooks/
                                        __pycache__/
                                        _in_process/
                                            __pycache__/
                                    rich/
                                        __pycache__/
                                    tomli_w/
                                        __pycache__/
                                    urllib3/
                                        util/
                                            __pycache__/
                                        __pycache__/
                                        contrib/
                                            __pycache__/
                                            _securetransport/
                                                __pycache__/
                                        packages/
                                            __pycache__/
                                            backports/
                                                __pycache__/
                                    pkg_resources/
                                        __pycache__/
                                    resolvelib/
                                        __pycache__/
                                        resolvers/
                                            __pycache__/
                                    platformdirs/
                                        __pycache__/
                                __pycache__/
                            tqdm/
                                __pycache__/
                                contrib/
                                    __pycache__/
                            tqdm-4.67.3.dist-info/
                                licenses/
                            rapidfuzz/
                                __pyinstaller/
                                    __pycache__/
                                distance/
                                    __pycache__/
                                __pycache__/
                            pip-26.0.dist-info/
                                licenses/
                                    src/
                                        pip/
                                            _vendor/
                                                packaging/
                                                truststore/
                                                msgpack/
                                                dependency_groups/
                                                pygments/
                                                distlib/
                                                distro/
                                                cachecontrol/
                                                idna/
                                                    LICENSE.md
                                                requests/
                                                tomli/
                                                certifi/
                                                pyproject_hooks/
                                                rich/
                                                tomli_w/
                                                urllib3/
                                                pkg_resources/
                                                resolvelib/
                                                platformdirs/
        venv/
            bin/
            include/
            lib/
                python3.14/
                    site-packages/
                        requests-2.32.5.dist-info/
                            licenses/
                        certifi-2026.2.25.dist-info/
                            licenses/
                        charset_normalizer-3.4.5.dist-info/
                            licenses/
                        idna-3.11.dist-info/
                            licenses/
                                LICENSE.md
                        idna/
                            __pycache__/
                        __pycache__/
                        numpy/
                            _utils/
                                __pycache__/
                            strings/
                                __pycache__/
                            char/
                                __pycache__/
                            core/
                                __pycache__/
                            linalg/
                                tests/
                                    __pycache__/
                                __pycache__/
                            ctypeslib/
                                __pycache__/
                            ma/
                                tests/
                                    __pycache__/
                                __pycache__/
                            _core/
                                include/
                                    numpy/
                                        random/
                                tests/
                                    __pycache__/
                                    examples/
                                        cython/
                                            __pycache__/
                                        limited_api/
                                            __pycache__/
                                    data/
                                __pycache__/
                                lib/
                                    pkgconfig/
                                    npy-pkg-config/
                            _typing/
                                __pycache__/
                            tests/
                                __pycache__/
                            _pyinstaller/
                                tests/
                                    __pycache__/
                                __pycache__/
                            __pycache__/
                            rec/
                                __pycache__/
                            typing/
                                tests/
                                    __pycache__/
                                    data/
                                        misc/
                                        fail/
                                        pass/
                                            __pycache__/
                                        reveal/
                                __pycache__/
                            f2py/
                                _backends/
                                    __pycache__/
                                tests/
                                    __pycache__/
                                    src/
                                        abstract_interface/
                                        isocintrin/
                                        return_character/
                                        f2cmap/
                                        mixed/
                                        return_complex/
                                        quoted_character/
                                        array_from_pyobj/
                                        cli/
                                        kind/
                                        value_attrspec/
                                        negative_bounds/
                                        common/
                                        routines/
                                        return_real/
                                        assumed_shape/
                                        block_docstring/
                                        return_integer/
                                        return_logical/
                                        parameter/
                                        string/
                                        callback/
                                        size/
                                        regression/
                                        crackfortran/
                                        modules/
                                            gh26920/
                                            gh25337/
                                __pycache__/
                                src/
                            testing/
                                tests/
                                    __pycache__/
                                __pycache__/
                                _private/
                                    __pycache__/
                            lib/
                                tests/
                                    __pycache__/
                                    data/
                                __pycache__/
                            fft/
                                tests/
                                    __pycache__/
                                __pycache__/
                            doc/
                                __pycache__/
                            random/
                                LICENSE.md
                                tests/
                                    __pycache__/
                                    data/
                                        __pycache__/
                                __pycache__/
                                lib/
                                _examples/
                                    cffi/
                                        __pycache__/
                                    cython/
                                    numba/
                                        __pycache__/
                            matrixlib/
                                tests/
                                    __pycache__/
                                __pycache__/
                            polynomial/
                                tests/
                                    __pycache__/
                                __pycache__/
                        charset_normalizer/
                            __pycache__/
                            cli/
                                __pycache__/
                        requests/
                            __pycache__/
                        pip/
                            _internal/
                                network/
                                    __pycache__/
                                utils/
                                    __pycache__/
                                models/
                                    __pycache__/
                                __pycache__/
                                cli/
                                    __pycache__/
                                operations/
                                    install/
                                        __pycache__/
                                    __pycache__/
                                    build/
                                        __pycache__/
                                req/
                                    __pycache__/
                                resolution/
                                    legacy/
                                        __pycache__/
                                    __pycache__/
                                    resolvelib/
                                        __pycache__/
                                vcs/
                                    __pycache__/
                                locations/
                                    __pycache__/
                                index/
                                    __pycache__/
                                commands/
                                    __pycache__/
                                metadata/
                                    __pycache__/
                                    importlib/
                                        __pycache__/
                                distributions/
                                    __pycache__/
                            _vendor/
                                packaging/
                                    licenses/
                                        __pycache__/
                                    __pycache__/
                                truststore/
                                    __pycache__/
                                msgpack/
                                    __pycache__/
                                dependency_groups/
                                    __pycache__/
                                pygments/
                                    filters/
                                        __pycache__/
                                    lexers/
                                        __pycache__/
                                    formatters/
                                        __pycache__/
                                    __pycache__/
                                    styles/
                                        __pycache__/
                                distlib/
                                    __pycache__/
                                distro/
                                    __pycache__/
                                cachecontrol/
                                    __pycache__/
                                    caches/
                                        __pycache__/
                                idna/
                                    LICENSE.md
                                    __pycache__/
                                __pycache__/
                                requests/
                                    __pycache__/
                                tomli/
                                    __pycache__/
                                certifi/
                                    __pycache__/
                                pyproject_hooks/
                                    __pycache__/
                                    _in_process/
                                        __pycache__/
                                rich/
                                    __pycache__/
                                tomli_w/
                                    __pycache__/
                                urllib3/
                                    util/
                                        __pycache__/
                                    __pycache__/
                                    contrib/
                                        __pycache__/
                                        _securetransport/
                                            __pycache__/
                                    packages/
                                        __pycache__/
                                        backports/
                                            __pycache__/
                                pkg_resources/
                                    __pycache__/
                                resolvelib/
                                    __pycache__/
                                    resolvers/
                                        __pycache__/
                                platformdirs/
                                    __pycache__/
                            __pycache__/
                        certifi/
                            __pycache__/
                        python_dateutil-2.9.0.post0.dist-info/
                        tqdm/
                            __pycache__/
                            contrib/
                                __pycache__/
                        urllib3-2.6.3.dist-info/
                            licenses/
                        pandas-3.0.1.dist-info/
                        urllib3/
                            util/
                                __pycache__/
                            __pycache__/
                            contrib/
                                __pycache__/
                                emscripten/
                                    __pycache__/
                            http2/
                                __pycache__/
                        tqdm-4.67.3.dist-info/
                            licenses/
                        six-1.17.0.dist-info/
                        pandas/
                            compat/
                                __pycache__/
                                numpy/
                                    __pycache__/
                            core/
                                indexers/
                                    __pycache__/
                                reshape/
                                    __pycache__/
                                strings/
                                    __pycache__/
                                tools/
                                    __pycache__/
                                methods/
                                    __pycache__/
                                util/
                                    __pycache__/
                                array_algos/
                                    __pycache__/
                                interchange/
                                    __pycache__/
                                __pycache__/
                                dtypes/
                                    __pycache__/
                                groupby/
                                    __pycache__/
                                internals/
                                    __pycache__/
                                computation/
                                    __pycache__/
                                _numba/
                                    kernels/
                                        __pycache__/
                                    __pycache__/
                                window/
                                    __pycache__/
                                arrays/
                                    arrow/
                                        __pycache__/
                                    __pycache__/
                                    sparse/
                                        __pycache__/
                                ops/
                                    __pycache__/
                                sparse/
                                    __pycache__/
                                indexes/
                                    __pycache__/
                            util/
                                __pycache__/
                                version/
                                    __pycache__/
                            io/
                                parsers/
                                    __pycache__/
                                formats/
                                    __pycache__/
                                    templates/
                                excel/
                                    __pycache__/
                                __pycache__/
                                json/
                                    __pycache__/
                                sas/
                                    __pycache__/
                                clipboard/
                                    __pycache__/
                            tseries/
                                __pycache__/
                            tests/
                                series/
                                    methods/
                                        __pycache__/
                                    accessors/
                                        __pycache__/
                                    __pycache__/
                                    indexing/
                                        __pycache__/
                                reshape/
                                    concat/
                                        __pycache__/
                                    merge/
                                        __pycache__/
                                    __pycache__/
                                apply/
                                    __pycache__/
                                strings/
                                    __pycache__/
                                tools/
                                    __pycache__/
                                extension/
                                    decimal/
                                        __pycache__/
                                    array_with_attr/
                                        __pycache__/
                                    date/
                                        __pycache__/
                                    __pycache__/
                                    json/
                                        __pycache__/
                                    list/
                                        __pycache__/
                                    uuid/
                                        __pycache__/
                                    base/
                                        __pycache__/
                                resample/
                                    __pycache__/
                                util/
                                    __pycache__/
                                config/
                                    __pycache__/
                                io/
                                    formats/
                                        style/
                                            __pycache__/
                                        __pycache__/
                                    excel/
                                        __pycache__/
                                    __pycache__/
                                    parser/
                                        usecols/
                                            __pycache__/
                                        __pycache__/
                                        dtypes/
                                            __pycache__/
                                        common/
                                            __pycache__/
                                    xml/
                                        __pycache__/
                                    json/
                                        __pycache__/
                                    sas/
                                        __pycache__/
                                    pytables/
                                        __pycache__/
                                tseries/
                                    holiday/
                                        __pycache__/
                                    frequencies/
                                        __pycache__/
                                    __pycache__/
                                    offsets/
                                        __pycache__/
                                copy_view/
                                    __pycache__/
                                    index/
                                        __pycache__/
                                interchange/
                                    __pycache__/
                                frame/
                                    methods/
                                        __pycache__/
                                    __pycache__/
                                    constructors/
                                        __pycache__/
                                    indexing/
                                        __pycache__/
                                __pycache__/
                                dtypes/
                                    cast/
                                        __pycache__/
                                    __pycache__/
                                libs/
                                    __pycache__/
                                groupby/
                                    methods/
                                        __pycache__/
                                    aggregate/
                                        __pycache__/
                                    __pycache__/
                                    transform/
                                        __pycache__/
                                internals/
                                    __pycache__/
                                computation/
                                    __pycache__/
                                plotting/
                                    frame/
                                        __pycache__/
                                    __pycache__/
                                window/
                                    moments/
                                        __pycache__/
                                    __pycache__/
                                arrays/
                                    string_/
                                        __pycache__/
                                    interval/
                                        __pycache__/
                                    masked/
                                        __pycache__/
                                    period/
                                        __pycache__/
                                    __pycache__/
                                    categorical/
                                        __pycache__/
                                    datetimes/
                                        __pycache__/
                                    timedeltas/
                                        __pycache__/
                                    boolean/
                                        __pycache__/
                                    integer/
                                        __pycache__/
                                    floating/
                                        __pycache__/
                                    sparse/
                                        __pycache__/
                                    numpy_/
                                        __pycache__/
                                arithmetic/
                                    __pycache__/
                                construction/
                                    __pycache__/
                                api/
                                    __pycache__/
                                generic/
                                    __pycache__/
                                tslibs/
                                    __pycache__/
                                indexing/
                                    interval/
                                        __pycache__/
                                    __pycache__/
                                    multiindex/
                                        __pycache__/
                                reductions/
                                    __pycache__/
                                scalar/
                                    interval/
                                        __pycache__/
                                    timedelta/
                                        methods/
                                            __pycache__/
                                        __pycache__/
                                    period/
                                        __pycache__/
                                    __pycache__/
                                    timestamp/
                                        methods/
                                            __pycache__/
                                        __pycache__/
                                base/
                                    __pycache__/
                                indexes/
                                    ranges/
                                        __pycache__/
                                    base_class/
                                        __pycache__/
                                    interval/
                                        __pycache__/
                                    multi/
                                        __pycache__/
                                    period/
                                        methods/
                                            __pycache__/
                                        __pycache__/
                                    __pycache__/
                                    categorical/
                                        __pycache__/
                                    numeric/
                                        __pycache__/
                                    object/
                                        __pycache__/
                                    datetimes/
                                        methods/
                                            __pycache__/
                                        __pycache__/
                                    timedeltas/
                                        methods/
                                            __pycache__/
                                        __pycache__/
                                    string/
                                        __pycache__/
                                    datetimelike_/
                                        __pycache__/
                            _testing/
                                __pycache__/
                            __pycache__/
                            _libs/
                                __pycache__/
                                window/
                                    __pycache__/
                                tslibs/
                                    __pycache__/
                            plotting/
                                __pycache__/
                                _matplotlib/
                                    __pycache__/
                            arrays/
                                __pycache__/
                            api/
                                indexers/
                                    __pycache__/
                                types/
                                    __pycache__/
                                interchange/
                                    __pycache__/
                                __pycache__/
                                extensions/
                                    __pycache__/
                                typing/
                                    __pycache__/
                                executors/
                                    __pycache__/
                            errors/
                                __pycache__/
                            _config/
                                __pycache__/
                        dateutil/
                            zoneinfo/
                                __pycache__/
                            __pycache__/
                            parser/
                                __pycache__/
                            tz/
                                __pycache__/
                        pip-26.0.dist-info/
                            licenses/
                                src/
                                    pip/
                                        _vendor/
                                            packaging/
                                            truststore/
                                            msgpack/
                                            dependency_groups/
                                            pygments/
                                            distlib/
                                            distro/
                                            cachecontrol/
                                            idna/
                                                LICENSE.md
                                            requests/
                                            tomli/
                                            certifi/
                                            pyproject_hooks/
                                            rich/
                                            tomli_w/
                                            urllib3/
                                            pkg_resources/
                                            resolvelib/
                                            platformdirs/
                        numpy-2.4.2.dist-info/
                            licenses/
                                numpy/
                                    linalg/
                                        lapack_lite/
                                    ma/
                                    _core/
                                        include/
                                            numpy/
                                                libdivide/
                                        src/
                                            npysort/
                                                x86-simd-sort/
                                                    LICENSE.md
                                            highway/
                                            multiarray/
                                            common/
                                                pythoncapi-compat/
                                            umath/
                                                svml/
                                    fft/
                                        pocketfft/
                                            LICENSE.md
                                    random/
                                        LICENSE.md
                                        src/
                                            mt19937/
                                                LICENSE.md
                                            sfc64/
                                                LICENSE.md
                                            pcg64/
                                                LICENSE.md
                                            philox/
                                                LICENSE.md
                                            splitmix64/
                                                LICENSE.md
                                            distributions/
                                                LICENSE.md
    utility/
    src/
        middleware.ts
        types/
            supabase.ts
        app/
            layout.tsx
            page.tsx
            globals.css
            auth/
                callback/
                    route.ts
            sphere/
                page.tsx
            actions/
                graph.ts
            api/
                onboarding/
                    complete/
                        route.ts
                    reset/
                        route.ts
            (auth)/
                login/
                    page.tsx
            fonts/
            onboarding/
                layout.tsx
                page.tsx
        components/
            sphere.css
            SemanticSphere.tsx
            ui/
                tabs.tsx
                card.tsx
                label.tsx
                button.tsx
                input.tsx
                form.tsx
            home/
                EditorialSection.tsx
                NowShowingCarousel.tsx
            layout/
                Footer.tsx
            sphere/
                ShellNavigator.tsx
            onboarding/
                OnboardingFlow.tsx
        lib/
            utils.ts
            graph/
                traversal.test.ts
                traversal.ts
            supabase/
                middleware.ts
                client.ts
                server.ts
```

## File: src/app/actions/graph.ts
```ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { FilmNode, FilmEdge } from "@/components/SemanticSphere";

const SHELL_POSTER_COLORS = [
    ["#0d1b35", "#1a3a6b", "#2d5a8e"], // Shell 0
    ["#051a15", "#0d3a28", "#1a5a3a"], // Shell 1
    ["#1a1d26", "#2a3245", "#3c4866"], // Shell 2
];

interface FilmWithRelations {
    id: number;
    title: string;
    year: number | null;
    director: string | null;
    poster_url: string | null;
    film_themes: { theme: string }[];
    film_genres: { genre: string }[];
}

export async function getPersonalizedGraph() {
    const supabase = await createClient();

    // 1. Get Current User
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // 2. FETCH SHELL 0 (Pillars)
    const { data: pillars, error: pillarErr } = await supabase
        .from('user_pillars')
        .select(`
      rank,
      films (
        id, title, year, director, poster_url,
        film_themes (theme),
        film_genres (genre)
      )
    `)
        .eq('user_id', user.id)
        .order('rank', { ascending: true });

    if (pillarErr) {
        console.error(`[Graph] Error fetching pillars for user ${user.id}:`, pillarErr);
        throw pillarErr;
    }

    console.log(`[Graph] Fetched ${pillars?.length || 0} pillars for user ${user.id}`);

    const nodes: FilmNode[] = [];
    const edgeSet = new Set<string>(); // To prevent duplicate edges
    const filmIdToIndex = new Map<number, number>();

    // Process Shell 0
    const pillarIds = (pillars || []).map(p => {
        const f = (p.films as unknown as FilmWithRelations);
        if (!f) return null;

        const idx = nodes.length;
        filmIdToIndex.set(f.id, idx);

        const tags = [
            ...(f.film_themes || []).map((t) => t.theme),
            ...(f.film_genres || []).map((g) => g.genre)
        ].slice(0, 4);

        nodes.push({
            id: f.id,
            title: f.title,
            year: f.year || 0,
            dir: f.director || "Unknown",
            shell: 0,
            tags,
            poster_url: f.poster_url,
            poster: SHELL_POSTER_COLORS[0]
        });
        return f.id;
    }).filter(Boolean) as number[];

    // 3. FETCH SHELL 1 (Connections of Shell 0)
    if (pillarIds.length > 0) {
        const { data: edges1, error: err1 } = await supabase
            .from('editorial_edges')
            .select(`
        type, weight, label,
        from_film_id, to_film_id
      `)
            .or(`from_film_id.in.(${pillarIds.join(',')}),to_film_id.in.(${pillarIds.join(',')})`);

        if (err1) console.error("Error fetching edges1:", err1);

        const shell1Ids = new Set<number>();
        if (edges1) {
            for (const e of edges1) {
                const otherId = pillarIds.includes(e.from_film_id) ? e.to_film_id : e.from_film_id;
                if (!filmIdToIndex.has(otherId)) {
                    shell1Ids.add(otherId);
                }
            }
        }

        // Load Shell 1 nodes
        if (shell1Ids.size > 0) {
            const { data: nodes1 } = await supabase
                .from('films')
                .select(`
          id, title, year, director, poster_url,
          film_themes (theme),
          film_genres (genre)
        `)
                .in('id', Array.from(shell1Ids))
                .limit(40); // Cap Shell 1

            if (nodes1) {
                for (const f_raw of nodes1) {
                    const f = f_raw as unknown as FilmWithRelations;
                    const idx = nodes.length;
                    filmIdToIndex.set(f.id, idx);
                    const tags = [
                        ...(f.film_themes || []).map((t) => t.theme),
                        ...(f.film_genres || []).map((g) => g.genre)
                    ].slice(0, 4);

                    nodes.push({
                        id: f.id,
                        title: f.title,
                        year: f.year || 0,
                        dir: f.director || "Unknown",
                        shell: 1,
                        tags,
                        poster_url: f.poster_url,
                        poster: SHELL_POSTER_COLORS[1]
                    });
                }
            }
        }

        // 4. FETCH SHELL 2 (Connections of Shell 1)
        const currentShell1Ids = Array.from(shell1Ids);
        if (currentShell1Ids.length > 0 && nodes.length < 90) {
            const { data: edges2 } = await supabase
                .from('editorial_edges')
                .select('from_film_id, to_film_id')
                .or(`from_film_id.in.(${currentShell1Ids.join(',')}),to_film_id.in.(${currentShell1Ids.join(',')})`)
                .limit(200);

            const shell2Ids = new Set<number>();
            if (edges2) {
                for (const e of edges2) {
                    const otherId = currentShell1Ids.includes(e.from_film_id) ? e.to_film_id : e.from_film_id;
                    if (!filmIdToIndex.has(otherId)) {
                        shell2Ids.add(otherId);
                    }
                }
            }

            if (shell2Ids.size > 0) {
                const { data: nodes2 } = await supabase
                    .from('films')
                    .select(`
            id, title, year, director, poster_url,
            film_themes (theme),
            film_genres (genre)
          `)
                    .in('id', Array.from(shell2Ids))
                    .limit(100 - nodes.length); // Stay under 100 total

                if (nodes2) {
                    for (const f_raw of nodes2) {
                        const f = f_raw as unknown as FilmWithRelations;
                        const idx = nodes.length;
                        filmIdToIndex.set(f.id, idx);
                        const tags = [
                            ...(f.film_themes || []).map((t) => t.theme),
                            ...(f.film_genres || []).map((g) => g.genre)
                        ].slice(0, 4);

                        nodes.push({
                            id: f.id,
                            title: f.title,
                            year: f.year || 0,
                            dir: f.director || "Unknown",
                            shell: 2,
                            tags,
                            poster_url: f.poster_url,
                            poster: SHELL_POSTER_COLORS[2]
                        });
                    }
                }
            }
        }
    }

    // 5. FINAL EDGE CONSTRUCTION
    // Fetch ALL edges between ALL nodes in our set
    const allNodeIds = Array.from(filmIdToIndex.keys());
    const edges: FilmEdge[] = [];

    if (allNodeIds.length > 0) {
        const { data: dbEdges } = await supabase
            .from('editorial_edges')
            .select('from_film_id, to_film_id, type, label, weight')
            .or(`from_film_id.in.(${allNodeIds.join(',')}),to_film_id.in.(${allNodeIds.join(',')})`);

        if (dbEdges) {
            for (const e of dbEdges) {
                const fromIdx = filmIdToIndex.get(e.from_film_id);
                const toIdx = filmIdToIndex.get(e.to_film_id);

                if (fromIdx !== undefined && toIdx !== undefined) {
                    const pairKey = [fromIdx, toIdx].sort().join('-');
                    if (!edgeSet.has(pairKey)) {
                        edgeSet.add(pairKey);
                        edges.push({
                            from: fromIdx,
                            to: toIdx,
                            type: e.type,
                            label: e.label || ""
                        });
                    }
                }
            }
        }
    }

    return { nodes, edges };
}

```

## File: src/components/SemanticSphere.tsx
```tsx
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable */
"use client";
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import ShellNavigator, { ShellLevel } from './sphere/ShellNavigator';
import './sphere.css';
import { connectedTo, edgesOf, buildNavContext } from '../lib/graph/traversal';

export interface FilmNode {
    id: number;
    title: string;
    year: number;
    dir: string;
    shell: number;
    tags: string[];
    poster?: string[];
    poster_url?: string | null;
}

export interface FilmEdge {
    from: number;
    to: number;
    type: string;
    label: string;
}

interface SemanticSphereProps {
    files?: FilmNode[];
    edges?: FilmEdge[];
}

export default function SemanticSphere({ files = [], edges = [] }: SemanticSphereProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mounted = useRef(false);
    const [selectedFilm, setSelectedFilm] = React.useState<FilmNode | null>(null);
    const [selectedEdges, setSelectedEdges] = React.useState<any[]>([]);

    const [activeShell, setActiveShell] = React.useState<ShellLevel>(0);
    const activeShellRef = useRef(0);
    const [isAnimating, setIsAnimating] = React.useState(false);
    const sphereApi = useRef<any>(null);

    const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
    const titleRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        activeShellRef.current = activeShell;
        if (sphereApi.current) {
            setIsAnimating(true);
            sphereApi.current.setShell(activeShell);

            // Flash overlay trigger
            const flash = document.getElementById('shell-flash');
            if (flash) {
                flash.style.opacity = '1';
                setTimeout(() => { flash.style.opacity = '0'; }, 150);
            }

            setTimeout(() => setIsAnimating(false), 1000); // lock nav during transition
        }
    }, [activeShell]);

    useEffect(() => {
        if (mounted.current) return;
        if (files.length === 0) return; // wait for data or skip if empty
        mounted.current = true;

        // Wrap the original script inside this effect
        // ═══════════════════════════════════════════════════════════
        // DATA
        // ═══════════════════════════════════════════════════════════
        const FILMS = files;
        const EDGES = edges;

        const ECFG = {
            thematic: { from: 0x78272e, to: 0xb58c2a, base: .6 },
            stylistic: { from: 0xb58c2a, to: 0x3b8b9e, base: .5 },
            contrast: { from: 0x3b8b9e, to: 0x225560, base: .3 },
        };

        // ═══════════════════════════════════════════════════════════
        // NODE DIMENSIONS
        // ═══════════════════════════════════════════════════════════

        const NCFG = [
            { color: 0x78272e, size: .05, glow: .10 }, // shell 0
            { color: 0xb58c2a, size: .0075, glow: .02 }, // shell 1
            { color: 0x3b8b9e, size: .0037, glow: .01 }, // shell 2
        ];


        let targetCameraZ = 3; // Starts at shell 0
        const camTarget = new THREE.Vector3(0, 0, 3.5);
        const lookTarget = new THREE.Vector3(0, 0, 0);
        const TWEEN_TASKS: any[] = []; // Custom tweening engine

        function addTween(obj, prop, target, duration, delay = 0) {
            TWEEN_TASKS.push({
                obj, prop, start: obj[prop], target,
                duration, delay, elapsed: 0
            });
        }

        sphereApi.current = {
            setShell: (shell: number) => {
                const zTargets = { 0: 3, 1: 5.5, 2: 8.5 };
                targetCameraZ = zTargets[shell];

                FILMS.forEach((f, i) => {
                    const isVisible = f.shell === shell;
                    const isCurrentShell = f.shell === shell;

                    // Show only nodes on the active shell; connected nodes from other shells revealed on click
                    let shouldShow = isVisible;
                    if (shell === 2 && f.shell === 2) {
                        if (navContext) {
                            // Only show if connected to navContext.current
                            const conns = connectedTo(navContext.current, EDGES);
                            if (!conns.has(i)) shouldShow = false;
                        } else {
                            // If no focused node, show none or all? Let's show all for now, or maybe none.
                            // Rules: "Mostrare solo i nodi Shell 2 collegati al film selezionato in Shell 1."
                            // If none selected, don't show Shell 2 nodes.
                            shouldShow = false;
                        }
                    }

                    const targetOp = shouldShow ? NCFG[f.shell].glow : 0;
                    const targetBaseOp = shouldShow ? 1 : 0; // for nodeMeshes

                    if (shouldShow) {
                        const baseDelay = isCurrentShell ? f.shell * 300 : 0;
                        const individualDelay = isCurrentShell ? i * 5 : 0;
                        const delay = baseDelay + individualDelay;
                        addTween(glowMeshes[i].material, 'opacity', targetOp, 600, delay);
                        addTween(nodeMeshes[i].material, 'opacity', targetBaseOp, 600, delay);
                    } else {
                        addTween(glowMeshes[i].material, 'opacity', 0, 400, 0);
                        addTween(nodeMeshes[i].material, 'opacity', 0, 400, 0);
                    }
                });

                // Hide/show edges
                edgeLines.forEach((l, i) => {
                    const e = EDGES[i];
                    const v1 = FILMS[e.from].shell <= shell;
                    const v2 = FILMS[e.to].shell <= shell;
                    const targetBase = (v1 && v2) ? ECFG[e.type].base * 0.8 : 0;
                    addTween(l.material, 'opacity', targetBase, 500, 0);
                });
            }
        };

        // ═══════════════════════════════════════════════════════════
        // THREE SETUP
        // ═══════════════════════════════════════════════════════════
        const canvas = document.getElementById('c');
        const W = () => window.innerWidth, H = () => window.innerHeight;
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
        renderer.setSize(W(), H());
        renderer.setClearColor(0x000000, 0);

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0xc8b89a, .004);
        const camera = new THREE.PerspectiveCamera(48, W() / H(), .1, 500);
        camera.position.set(0, 0, 3.5);

        const RADII = [1.5, 3.5, 7.5];
        const SHELL_DISTANCES = [4.5, 10.0, 18.5];

        // Shell wireframes to help understand dimensions
        RADII.forEach((r, i) => {
            const geo = new THREE.SphereGeometry(r, 64, 32);
            const mat = new THREE.MeshBasicMaterial({ color: NCFG[i].color, wireframe: true, transparent: true, opacity: 0.05 });
            const s = new THREE.Mesh(geo, mat);
            scene.add(s);
        });

        const group = new THREE.Group();
        scene.add(group);

        // Fibonacci positions on each shell
        function fibPos(idx, total, R) {
            const phi = Math.PI * (3 - Math.sqrt(5));
            const y = 1 - (idx / Math.max(total - 1, 1)) * 2;
            const r = Math.sqrt(Math.max(0, 1 - y * y));
            const th = phi * idx;
            return new THREE.Vector3(Math.cos(th) * r * R, y * R, Math.sin(th) * r * R);
        }
        const byShell = [[], [], []];
        FILMS.forEach((f, index) => {
            // we attach the index to the film object temporarily to use it later
            (f as any)._index = index;
            byShell[f.shell].push(f)
        });
        const positions = new Array(FILMS.length);
        byShell.forEach((films, s) => films.forEach((f: any, i) => {
            if (f._index !== undefined) {
                positions[f._index] = fibPos(i, films.length, RADII[s]);
            }
        }));

        // Nodes
        const nodeMeshes: THREE.Mesh[] = [], glowMeshes: THREE.Mesh[] = [];
        FILMS.forEach((f: any, index) => {
            const cfg = NCFG[f?.shell] || NCFG[2]; // Fallback to shell 2 
            const pos = positions[index] || new THREE.Vector3(0, 0, 0);
            const initVisible = f.shell === 0;
            const core = new THREE.Mesh(
                new THREE.SphereGeometry(cfg.size, 20, 14),
                new THREE.MeshBasicMaterial({ color: cfg.color, transparent: true, opacity: initVisible ? 1 : 0 })
            );
            core.position.copy(pos);
            core.userData.index = index;
            group.add(core); nodeMeshes.push(core);

            const gl = new THREE.Mesh(
                new THREE.SphereGeometry(cfg.size * 3.5, 16, 12),
                new THREE.MeshBasicMaterial({ color: cfg.color, transparent: true, opacity: initVisible ? cfg.glow : 0, blending: THREE.NormalBlending })
            );
            gl.position.copy(pos);
            gl.userData.index = index; // Allow raycasting on glow
            group.add(gl); glowMeshes.push(gl);
        });

        // Edges
        const edgeLines = [];
        function buildEdge(a, b, cfg) {
            const mid = a.clone().add(b).multiplyScalar(.5);
            mid.add(mid.clone().normalize().multiplyScalar(a.distanceTo(b) * .3));
            const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
            const pts = curve.getPoints(50);
            const pos3 = [], cols = [];
            const cA = new THREE.Color(cfg.from), cB = new THREE.Color(cfg.to), tmp = new THREE.Color();
            pts.forEach((p, i) => {
                pos3.push(p.x, p.y, p.z);
                tmp.lerpColors(cA, cB, i / (pts.length - 1));
                cols.push(tmp.r, tmp.g, tmp.b);
            });
            const geo = new THREE.BufferGeometry();
            geo.setAttribute('position', new THREE.Float32BufferAttribute(pos3, 3));
            geo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
            return new THREE.Line(geo, new THREE.LineBasicMaterial({
                vertexColors: true, transparent: true, opacity: cfg.base, blending: THREE.NormalBlending
            }));
        }
        EDGES.forEach((e, i) => {
            const l = buildEdge(positions[e.from], positions[e.to], ECFG[e.type]);
            l.userData.edgeIdx = i; group.add(l); edgeLines.push(l);
        });

        // Space visuals removed per user request

        // ═══════════════════════════════════════════════════════════
        // LABELS
        // ═══════════════════════════════════════════════════════════
        function updateLabels(hov: number | null, sel: number | null) {
            const tmp = new THREE.Vector3();
            FILMS.forEach((f, index) => {
                const el = labelRefs.current[index];
                const lt = titleRefs.current[index];
                if (!el || !lt) return;
                const p = positions[index].clone().applyEuler(group.rotation);
                tmp.copy(p).project(camera);
                el.style.left = (tmp.x * .5 + .5) * W() + 'px';
                el.style.top = (-.5 * tmp.y + .5) * H() + 'px';

                // Hide labels in the header area (top 100px)
                const yPos = (-.5 * tmp.y + .5) * H();
                const isOverHeader = yPos < 100;

                // Adjust label offset: use smaller multiplier for smaller nodes
                const offset = NCFG[f.shell].size * 100 + 8;
                el.style.transform = `translate(-50%,calc(-50% - ${offset}px))`;

                const behind = tmp.z > 1;
                let op = 0;
                if (isOverHeader) {
                    op = 0;
                } else if (sel !== null) {
                    const active = navContext && navContext.visible.has(f.id);
                    // Selected node is ALWAYS visible regardless of depth/behind
                    if (f.id === sel) {
                        op = 1;
                    } else {
                        op = active && !behind ? 0.75 : 0;
                    }
                } else if (hov !== null) {
                    op = connectedTo(hov, EDGES).has(f.id) ? (f.id === hov ? 1 : .7) : 0;
                } else {
                    op = .22;
                }
                el.style.opacity = behind ? "0" : op.toString();
                if (f.id === sel) {
                    lt.classList.add('active');
                } else {
                    lt.classList.remove('active');
                }
            });
        }

        // ═══════════════════════════════════════════════════════════
        // NAVIGATION STATE
        // ═══════════════════════════════════════════════════════════
        // navContext: { current, parent, siblings, siblingIndex, children, visible(Set), stack }
        let navContext = null;
        let hoveredId = null;

        function applyNavContext(ctx) {
            navContext = ctx;
            const { current, parent, siblings, siblingIndex, children, visible } = ctx;

            // Reveal connected nodes (any shell), dim everything else
            FILMS.forEach((f, i) => {
                if (visible.has(i)) {
                    nodeMeshes[i].material.color.setHex(NCFG[f.shell].color);
                    nodeMeshes[i].material.opacity = 1;
                    glowMeshes[i].material.opacity = NCFG[f.shell].glow;
                } else {
                    nodeMeshes[i].material.color.setHex(0xe0ddd5);
                    nodeMeshes[i].material.opacity = 0.15;
                    glowMeshes[i].material.opacity = .008;
                }
            });
            edgeLines.forEach((l, i) => { l.material.opacity = ECFG[EDGES[i].type].base; });
            edgeLines.forEach((l, i) => {
                const e = EDGES[i];
                const bothVis = visible.has(e.from) && visible.has(e.to);
                const isActive = (e.from === current || e.to === current);
                l.material.opacity = isActive ? ECFG[e.type].base * 2.8 : bothVis ? ECFG[e.type].base * .8 : .01;
            });

            // Highlight current
            const cfg = NCFG[FILMS[current].shell];
            const c = new THREE.Color(cfg.color);
            nodeMeshes[current].material.color.copy(c.clone().multiplyScalar(0.7));
            glowMeshes[current].material.opacity = .45;

            updateNavButtons(ctx);
            updateBreadcrumb(ctx);
            showPanel(current);
        }

        // ─── Nav buttons ────────────────────────────────────────────
        function updateNavButtons(ctx) {
            const { siblings, siblingIndex, parent, children } = ctx;
            const nc = document.getElementById('nav-controls');
            nc.classList.add('visible');

            // ↑ = outward (deeper/children) — pillars are center, expand outward
            // ↓ = inward  (back to parent/center)
            document.getElementById('btn-up').disabled = children.length === 0;
            document.getElementById('btn-down').disabled = parent === null;
            document.getElementById('btn-left').disabled = siblings.length <= 1;
            document.getElementById('btn-right').disabled = siblings.length <= 1;

            const ctr = document.getElementById('nav-counter');
            if (siblings.length > 1) {
                ctr.textContent = `${siblingIndex + 1} / ${siblings.length}`;
            } else { ctr.textContent = ''; }
        }

        // ↑ = outward — go deeper (children)
        document.getElementById('btn-up').addEventListener('click', () => {
            if (!navContext || !navContext.children || navContext.children.length === 0) return;
            const { current, children, stack } = navContext;
            const newStack = [...stack, { parent: navContext.parent, siblings: navContext.siblings, siblingIndex: navContext.siblingIndex }];
            const firstChild = children[0];
            if (firstChild === undefined) return;

            const firstShell = FILMS[firstChild].shell;
            const sameLevelSibs = children.filter(idx => FILMS[idx].shell === firstShell); // Use idx
            animatePanel('up', () => applyNavContext(buildNavContext(firstChild, current, sameLevelSibs, 0, newStack, FILMS, EDGES)));
        });

        // ↓ = inward — go back to parent
        document.getElementById('btn-down').addEventListener('click', () => {
            if (!navContext || navContext.parent === null) return;
            const { parent, stack } = navContext;
            const prev = stack.length ? stack[stack.length - 1] : null;
            const newStack = stack.slice(0, -1);
            animatePanel('down', () => applyNavContext(buildNavContext(parent, prev ? prev.parent : null, prev ? prev.siblings : null, prev ? prev.siblingIndex : 0, newStack, FILMS, EDGES)));
        });

        document.getElementById('btn-left').addEventListener('click', () => {
            if (!navContext) return;
            const { siblings, siblingIndex, parent, stack } = navContext;
            const newIdx = (siblingIndex - 1 + siblings.length) % siblings.length;
            const newId = siblings[newIdx];
            animatePanel('left', () => applyNavContext(buildNavContext(newId, parent, siblings, newIdx, stack, FILMS, EDGES)));
        });

        document.getElementById('btn-right').addEventListener('click', () => {
            if (!navContext) return;
            const { siblings, siblingIndex, parent, stack } = navContext;
            const newIdx = (siblingIndex + 1) % siblings.length;
            const newId = siblings[newIdx];
            animatePanel('right', () => applyNavContext(buildNavContext(newId, parent, siblings, newIdx, stack, FILMS, EDGES)));
        });

        // Breadcrumb
        function updateBreadcrumb(ctx) {
            const bc = document.getElementById('breadcrumb');
            const { stack, current } = ctx;
            if (stack.length === 0) {
                bc.classList.remove('visible');
                return;
            }
            bc.classList.add('visible');
            // Rebuild breadcrumb showing path
            // stack items have parent ids we can trace back... simplified: show shell labels
            const shellNames = ['Pilastri', 'Affinità', 'Scoperta'];
            const currentShell = FILMS[current].shell;
            let html = '';
            for (let i = 0; i < currentShell; i++) {
                html += `<span class="bc-item">${shellNames[i]}</span><span class="bc-sep">›</span>`;
            }
            html += `<span class="bc-current">${shellNames[currentShell]}</span>`;
            bc.innerHTML = html;
        }

        // ─── Panel animation ────────────────────────────────────────
        // dir: 'left'|'right'|'up'|'down'
        // The panel exits in `dir` direction, new content enters from the opposite side.
        function animatePanel(dir, callback) {
            const panel = document.getElementById('panel');
            // exit
            panel.style.transition = 'opacity 120ms ease, transform 120ms ease';
            const exitMap = { left: 'translateX(-18px)', right: 'translateX(18px)', up: 'translateY(-14px)', down: 'translateY(14px)' };
            const enterMap = { left: 'translateX(18px)', right: 'translateX(-18px)', up: 'translateY(14px)', down: 'translateY(-14px)' };
            panel.style.opacity = '0';
            panel.style.transform = exitMap[dir];
            setTimeout(() => {
                callback(); // updates content
                panel.style.transition = 'none';
                panel.style.opacity = '0';
                panel.style.transform = enterMap[dir];
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        panel.style.transition = 'opacity 160ms ease, transform 160ms ease';
                        panel.style.opacity = '1';
                        panel.style.transform = 'none';
                    });
                });
            }, 130);
        }

        // ─── Panel & Poster ─────────────────────────────────────────
        function showPanel(nodeIndex: number) {
            const film = FILMS[nodeIndex];
            const connEdges = EDGES.filter(e => e.from === nodeIndex || e.to === nodeIndex);
            const edgeData = connEdges.map(e => {
                const oid = e.from === nodeIndex ? e.to : e.from;
                return { id: e.from + '-' + e.to, type: e.type, film: FILMS[oid] };
            });
            setSelectedFilm(film);
            setSelectedEdges(edgeData);
        }

        function closePanel() {
            setSelectedFilm(null);
            document.getElementById('nav-controls')?.classList.remove('visible');
            document.getElementById('breadcrumb')?.classList.remove('visible');
            navContext = null;
            // Reset visuals
            FILMS.forEach((f, i) => {
                nodeMeshes[i].material.color.setHex(NCFG[f.shell].color);
                glowMeshes[i].material.opacity = NCFG[f.shell].glow;
            });
            edgeLines.forEach((l, i) => { l.material.opacity = ECFG[EDGES[i].type].base; });
        }

        window.addEventListener('closeSpherePanel', closePanel);

        // ═══════════════════════════════════════════════════════════
        // MOUSE
        // ═══════════════════════════════════════════════════════════
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        let isDown = false, isDragging = false, lastXY = { x: 0, y: 0 }, vel = { x: 0, y: 0 };

        function getHit(x, y) {
            mouse.x = (x / W()) * 2 - 1; mouse.y = -(y / H()) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            // Intersect both nodes and glows to increase hit area
            const hits = raycaster.intersectObjects([...nodeMeshes, ...glowMeshes]);
            const visibleHit = hits.find(h => h.object.material.opacity > 0);
            return visibleHit ? visibleHit.object.userData.index : null; // Return index
        }

        let scrollAccum = 0;
        const SCROLL_THRESHOLD = 80;
        let scrollLocked = false;

        window.addEventListener('wheel', e => {
            if (navContext) return; // locked while a film is selected
            const rect = canvas.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dist = Math.sqrt((e.clientX - cx) ** 2 + (e.clientY - cy) ** 2);
            const activeRadius = Math.min(rect.width, rect.height) * 0.45;

            if (dist < activeRadius && rect.bottom > 0) {
                e.preventDefault();
                if (scrollLocked) return;
                scrollAccum += e.deltaY;
                if (scrollAccum > SCROLL_THRESHOLD) {
                    scrollAccum = 0;
                    if (activeShellRef.current < 2) {
                        activeShellRef.current += 1;
                        setActiveShell(activeShellRef.current);
                        scrollLocked = true;
                        setTimeout(() => { scrollLocked = false; }, 800);
                    }
                } else if (scrollAccum < -SCROLL_THRESHOLD) {
                    scrollAccum = 0;
                    if (activeShellRef.current > 0) {
                        activeShellRef.current -= 1;
                        setActiveShell(activeShellRef.current);
                        scrollLocked = true;
                        setTimeout(() => { scrollLocked = false; }, 800);
                    }
                }
            }
        }, { passive: false });

        window.addEventListener('mousedown', e => {
            isDown = true; isDragging = false;
            lastXY = { x: e.clientX, y: e.clientY }; vel = { x: 0, y: 0 };
            document.body.classList.add('dragging');
        });

        window.addEventListener('mouseup', e => {
            isDown = false;
            document.body.classList.remove('dragging');
            if (!isDragging) {
                const hit = getHit(e.clientX, e.clientY);
                if (hit !== null) {
                    hoveredId = null;
                    // If we have a navContext and click on a visible node → navigate to it
                    if (navContext && navContext.visible.has(hit) && hit !== navContext.current) {
                        // Determine relation
                        if (navContext.children.includes(hit)) {
                            // Go deeper (outward) — animate up
                            const { current, children, stack } = navContext;
                            const newStack = [...stack, { parent: navContext.parent, siblings: navContext.siblings, siblingIndex: navContext.siblingIndex }];
                            const hitShell = FILMS[hit].shell;
                            const sameLevelSibs = children.filter(id => FILMS[id].shell === hitShell);
                            animatePanel('up', () => applyNavContext(buildNavContext(hit, current, sameLevelSibs, sameLevelSibs.indexOf(hit), newStack, FILMS, EDGES)));
                        } else if (navContext.siblings.includes(hit)) {
                            const { siblings, parent, stack } = navContext;
                            const newIdx = siblings.indexOf(hit);
                            const dir = newIdx > navContext.siblingIndex ? 'right' : 'left';
                            animatePanel(dir, () => applyNavContext(buildNavContext(hit, parent, siblings, newIdx, stack, FILMS, EDGES)));
                        } else if (hit === navContext.parent) {
                            document.getElementById('btn-down').click();
                        }
                    } else {
                        // Fresh selection
                        const film = FILMS[hit];
                        // USE INDICES for sibs, not IDs
                        const sibs = FILMS
                            .map((f, i) => f.shell === film.shell ? i : -1)
                            .filter(idx => idx !== -1);

                        applyNavContext(buildNavContext(hit, null, sibs, sibs.indexOf(hit), [], FILMS, EDGES));
                    }
                } else {
                    if (navContext) closePanel();
                }
            }
        });

        window.addEventListener('mousemove', e => {
            hoveredId = getHit(e.clientX, e.clientY);
            if (isDown) {
                isDragging = true;
                const dx = e.clientX - lastXY.x;
                const dy = e.clientY - lastXY.y;

                // Direct rotation during drag
                group.rotation.y += dx * 0.005;
                group.rotation.x += dy * 0.005;

                vel = { x: dy * 0.002, y: dx * 0.002 };
                lastXY = { x: e.clientX, y: e.clientY };
            }
        });

        // ─── TOUCH SUPPORT ───
        let touchStartShellY = 0;
        window.addEventListener('touchstart', e => {
            const t = e.touches[0];
            isDown = true; isDragging = false;
            lastXY = { x: t.clientX, y: t.clientY }; vel = { x: 0, y: 0 };
            touchStartShellY = t.clientY;
        }, { passive: false });

        window.addEventListener('touchend', e => {
            isDown = false;
            if (!isDragging) {
                const t = e.changedTouches[0];
                const hit = getHit(t.clientX, t.clientY);
                if (hit !== null) {
                    if (navContext && navContext.visible.has(hit) && hit !== navContext.current) {
                        if (navContext.children.includes(hit)) {
                            const { current, children, stack } = navContext;
                            const newStack = [...stack, { parent: navContext.parent, siblings: navContext.siblings, siblingIndex: navContext.siblingIndex }];
                            const hitShell = FILMS[hit].shell;
                            const sameLevelSibs = children.filter(id => FILMS[id].shell === hitShell);
                            animatePanel('up', () => applyNavContext(buildNavContext(hit, current, sameLevelSibs, sameLevelSibs.indexOf(hit), newStack, FILMS, EDGES)));
                        } else if (navContext.siblings.includes(hit)) {
                            const { siblings, parent, stack } = navContext;
                            const newIdx = siblings.indexOf(hit);
                            const dir = newIdx > navContext.siblingIndex ? 'right' : 'left';
                            animatePanel(dir, () => applyNavContext(buildNavContext(hit, parent, siblings, newIdx, stack, FILMS, EDGES)));
                        } else if (hit === navContext.parent) {
                            document.getElementById('btn-down')?.click();
                        }
                    } else {
                        const film = FILMS[hit];
                        const sibs = FILMS.map((f, i) => f.shell === film.shell ? i : -1).filter(idx => idx !== -1);
                        applyNavContext(buildNavContext(hit, null, sibs, sibs.indexOf(hit), [], FILMS, EDGES));
                    }
                } else if (navContext) {
                    closePanel();
                }
            }
        });

        window.addEventListener('touchmove', e => {
            if (isDown) {
                const t = e.touches[0];
                const dx = t.clientX - lastXY.x;
                const dy = t.clientY - lastXY.y;

                if (Math.abs(dx) > 2 || Math.abs(dy) > 2) isDragging = true;

                group.rotation.y += dx * 0.006;
                group.rotation.x += dy * 0.006;

                vel = { x: dy * 0.002, y: dx * 0.002 };
                lastXY = { x: t.clientX, y: t.clientY };

                // Shell switching via vertical swipe (if no film selected)
                if (!navContext && !scrollLocked) {
                    const deltaY = t.clientY - touchStartShellY;
                    if (Math.abs(deltaY) > 100) {
                        if (deltaY < 0 && activeShellRef.current < 2) {
                            activeShellRef.current += 1;
                            setActiveShell(activeShellRef.current);
                            scrollLocked = true;
                            setTimeout(() => { scrollLocked = false; }, 800);
                        } else if (deltaY > 0 && activeShellRef.current > 0) {
                            activeShellRef.current -= 1;
                            setActiveShell(activeShellRef.current);
                            scrollLocked = true;
                            setTimeout(() => { scrollLocked = false; }, 800);
                        }
                        touchStartShellY = t.clientY;
                    }
                }
            }
        }, { passive: false });

        // Keyboard navigation — mirrors button logic (↑=outward, ↓=inward)
        window.addEventListener('keydown', e => {
            if (e.key === 'Escape') { closePanel(); return; }

            if (!navContext) {
                // Shell navigation mode — only when no film selected
                if (e.key === 'ArrowDown' && activeShellRef.current < 2) {
                    e.preventDefault();
                    activeShellRef.current += 1;
                    setActiveShell(activeShellRef.current);
                }
                if (e.key === 'ArrowUp' && activeShellRef.current > 0) {
                    e.preventDefault();
                    activeShellRef.current -= 1;
                    setActiveShell(activeShellRef.current);
                }
                return;
            }

            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
            if (e.key === 'ArrowUp') document.getElementById('btn-up')?.click();
            if (e.key === 'ArrowDown') document.getElementById('btn-down')?.click();
            if (e.key === 'ArrowLeft') document.getElementById('btn-left')?.click();
            if (e.key === 'ArrowRight') document.getElementById('btn-right')?.click();
        });

        // ═══════════════════════════════════════════════════════════
        // RENDER LOOP
        // ═══════════════════════════════════════════════════════════
        let t = 0;
        function animate() {
            requestAnimationFrame(animate);
            t += .01;

            // Camera & Centering
            if (navContext && navContext.current !== null) {
                const idx = navContext.current;
                const worldPos = new THREE.Vector3();
                nodeMeshes[idx].getWorldPosition(worldPos);
                // Project camera onto the orbital shell surface, never cutting through
                const dir = worldPos.clone().normalize();
                const orbitRadii = [4.5, 10.0, 18.5];
                const orbitRadius = orbitRadii[FILMS[idx].shell] + 1;
                camTarget.copy(dir).multiplyScalar(orbitRadius);
                lookTarget.lerp(worldPos, 0.06);
            } else {
                camTarget.set(0, 0, SHELL_DISTANCES[activeShellRef.current]);
                lookTarget.set(0, 0, 0);
            }

            // Slerp direzionale: la camera rimane sempre sulla superficie orbitale
            if (navContext && navContext.current !== null) {
                const currentDir = camera.position.clone().normalize();
                const targetDir = camTarget.clone().normalize();
                // Interpolazione sferica sulla direzione
                const slerpedDir = currentDir.clone().lerp(targetDir, 0.035).normalize();
                // Interpolazione lineare solo sul raggio (distanza dal centro)
                const currentRadius = camera.position.length();
                const targetRadius = camTarget.length();
                const newRadius = currentRadius + (targetRadius - currentRadius) * 0.035;
                camera.position.copy(slerpedDir.multiplyScalar(newRadius));
            } else {
                camera.position.lerp(camTarget, 0.035);
            }
            camera.lookAt(lookTarget);

            // Custom tweens
            for (let i = TWEEN_TASKS.length - 1; i >= 0; i--) {
                const task = TWEEN_TASKS[i];
                if (task.delay > 0) {
                    task.delay -= 16.6; // approx 1 frame at 60fps
                    continue;
                }
                task.elapsed += 16.6;
                const progress = Math.min(task.elapsed / task.duration, 1);
                // easeInOutQuad
                const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
                task.obj[task.prop] = task.start + (task.target - task.start) * ease;

                if (progress >= 1) TWEEN_TASKS.splice(i, 1);
            }

            // Auto-rotate when idle
            if (!isDown && !navContext && !hoveredId) {
                const rotSpeed = 0.0016 + activeShellRef.current * 0.0005;
                group.rotation.y += rotSpeed;
                group.rotation.x += 0.0002 + activeShellRef.current * 0.0001;
            }
            if (!isDown) {
                vel.x *= .93; vel.y *= .93;
                group.rotation.x += vel.x; group.rotation.y += vel.y;
            }
            // Pillar pulse
            if (!navContext && !hoveredId) {
                FILMS.forEach((f, i) => {
                    if (f.shell === 0) {
                        glowMeshes[i].material.opacity = NCFG[0].glow * (1 + Math.sin(t * 2 + i * 1.4) * .35);
                    }
                });
            }
            // Active shimmer
            if (navContext) {
                edgesOf(navContext.current, EDGES).forEach(i => {
                    const base = ECFG[EDGES[i].type].base;
                    edgeLines[i].material.opacity = base * (2.6 + Math.sin(t * 4 + i) * .35);
                });
            }
            updateLabels(hoveredId, navContext ? navContext.current : null);
            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = W() / H(); camera.updateProjectionMatrix();
            renderer.setSize(W(), H());
        });

        // Auto cleanup on unmount
        return () => {
            window.removeEventListener('resize', () => { });
            window.removeEventListener('mousemove', () => { });
            window.removeEventListener('mousedown', () => { });
            window.removeEventListener('mouseup', () => { });
            window.removeEventListener('wheel', () => { });
            window.removeEventListener('keydown', () => { });
            mounted.current = false;
        };
    }, []);

    return (
        <div id="sphere-canvas-container" className="main-sphere-wrapper" style={{ overflow: 'hidden', height: '100%', width: '100%', position: 'absolute', top: 0, left: 0, background: 'radial-gradient(ellipse 80% 70% at 50% 50%, #faf7f2 0%, #f0ebe0 30%, #e4ddd0 55%, #d8cfc0 75%, #ccc2b0 100%)' }}>
            <canvas id="c" style={{ position: 'absolute', inset: 0, zIndex: 0 }} />

            <div id="labels" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}>
                {files.map((f, i) => (
                    <div
                        key={f.id}
                        ref={(el) => { labelRefs.current[i] = el; }}
                        className={`node-label label-${['pillar', 'primary', 'secondary'][f.shell]}`}
                    >
                        <div
                            className="label-title"
                            id={`lt-${i}`}
                            ref={(el) => { titleRefs.current[i] = el; }}
                        >
                            {f.title}
                        </div>
                    </div>
                ))}
            </div>

            <div id="shell-flash" style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: 'radial-gradient(ellipse at center, rgba(248,244,238,0.65) 0%, transparent 65%)',
                opacity: 0, transition: 'opacity 0.5s ease', zIndex: 5
            }} />

            <header className="sphere-header" style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
                <div className="sh-left">
                    <div className="sh-logo">SFERA <em>SEMANTICA</em></div>
                    <div className="sh-hint">SCROLL · cambia shell</div>
                </div>
                <div className="hints">
                    TRASCINA · ruota &nbsp;·&nbsp; SCROLL · zoom<br />
                    CLICK · seleziona nodo<br />
                    ↑↓ · cambia livello &nbsp;·&nbsp; ←→ · stesso livello
                </div>
            </header>



            <div style={{ position: 'absolute', left: 28, top: '50%', transform: 'translateY(-50%)', zIndex: 10, display: 'flex', flexDirection: 'column', gap: 8, transformOrigin: 'left center' }}>
                <div style={{ transform: 'scale(0.82)', transformOrigin: 'left center' }}>
                    <ShellNavigator
                        activeShell={activeShell}
                        onShellChange={setActiveShell}
                        isAnimating={isAnimating}
                    />
                </div>
            </div>

            {/* Breadcrumb */}
            <div id="breadcrumb" style={{ position: 'absolute' }}></div>

            {/* Navigation */}
            <div id="nav-controls" style={{ position: 'absolute' }}>
                <button className="nav-btn" id="btn-up" disabled title="Esplora verso l'esterno">↑</button>
                <div className="nav-row">
                    <button className="nav-btn" id="btn-left" disabled title="Film precedente">←</button>
                    <button className="nav-btn" id="btn-down" disabled title="Torna verso il centro">↓</button>
                    <button className="nav-btn" id="btn-right" disabled title="Film successivo">→</button>
                </div>
                <div className="nav-counter" id="nav-counter"></div>
            </div>

            {/* Info Panel -> React State */}
            {selectedFilm && (
                <div id="panel" className="visible" style={{ position: 'absolute' }}>
                    <button id="panel-close" onClick={() => { setSelectedFilm(null); window.dispatchEvent(new Event('closeSpherePanel')); }}>×</button>
                    <div id="panel-poster">
                        <img id="poster-img"
                            src={selectedFilm.poster_url || '/placeholder.jpg'}
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
                            alt=""
                        />
                        <div className="poster-bg" id="poster-bg"></div>
                        <div className="poster-overlay"></div>
                        <div className="poster-content">
                            <div className="poster-eyebrow" id="poster-eyebrow"></div>
                            <div className="poster-film-title" id="poster-title">{selectedFilm.title}</div>
                            <div className="poster-film-meta" id="poster-meta">
                                <span style={{ opacity: .6, fontFamily: 'Fragment_Mono', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '10px' }}>{selectedFilm.dir}</span>
                                <span style={{ opacity: .3, margin: '0 8px' }}>|</span>
                                <span style={{ opacity: .5, fontFamily: 'Fragment_Mono', letterSpacing: '1px' }}>{selectedFilm.year}</span>
                            </div>
                        </div>
                    </div>
                    <div className="panel-body">
                        <div id="p-badge">
                            <div className={`p-badge p-badge-${['pillar', 'primary', 'secondary'][selectedFilm.shell]}`}>
                                {['Pilastro del gusto', 'Affinità diretta', 'Scoperta laterale'][selectedFilm.shell]}
                            </div>
                        </div>
                        <div className="p-section">Temi editoriali</div>
                        <div className="p-tags" id="p-tags">
                            {selectedFilm.tags.map((t: string) => <div key={t} className="p-tag">{t}</div>)}
                        </div>
                        {selectedEdges.length > 0 && (
                            <>
                                <div className="p-section" id="conn-section-label">Connessioni editoriali</div>
                                <div className="p-conns" id="p-conns">
                                    {selectedEdges.map((e: any) => (
                                        <div key={e.id} className="p-conn">
                                            <div className="p-conn-dot" style={{ background: ['var(--ember)', 'var(--gold)', 'var(--cold)'][e.film.shell] }}></div>
                                            <span>{e.film.title}</span>
                                            <span className="p-conn-type">· {e.type}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

```

## File: src/components/sphere/ShellNavigator.tsx
```tsx
'use client';

import React, { useEffect, useRef } from 'react';

export type ShellLevel = 0 | 1 | 2;

interface ShellNavigatorProps {
    activeShell: ShellLevel;
    onShellChange?: (shell: ShellLevel) => void;
    isAnimating?: boolean;
}

const SHELLS = [
    { level: 0 as ShellLevel, label: 'PILASTRI', color: '#78272e', colorRgb: '120,39,46' },
    { level: 1 as ShellLevel, label: 'AFFINITÀ', color: '#b58c2a', colorRgb: '181,140,42' },
    { level: 2 as ShellLevel, label: 'SCOPERTA', color: '#3b8b9e', colorRgb: '59,139,158' },
];

export default function ShellNavigator({ activeShell, onShellChange, isAnimating }: ShellNavigatorProps) {
    const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const prevShell = useRef<ShellLevel>(activeShell);

    useEffect(() => {
        import('animejs').then(({ default: anime }) => {
            const prev = prevShell.current;
            const next = activeShell;
            if (prev === next) return;
            prevShell.current = next;

            SHELLS.forEach(({ level }) => {
                const btn = btnRefs.current[level];
                const label = labelRefs.current[level];
                const dot = dotRefs.current[level];
                if (!btn || !label || !dot) return;

                const isActive = level === next;
                const wasActive = level === prev;

                if (isActive) {
                    anime.remove([btn, label, dot]);
                    anime({
                        targets: btn,
                        paddingLeft: ['0px', '10px'],
                        paddingRight: ['0px', '10px'],
                        duration: 420,
                        easing: 'cubicBezier(0.34, 1.56, 0.64, 1)',
                    });
                    anime({
                        targets: dot,
                        scale: [1, 1.3, 1],
                        duration: 400,
                        easing: 'easeOutElastic(1, .5)',
                    });
                    anime({
                        targets: label,
                        opacity: [0, 1],
                        translateX: ['-10px', '0px'],
                        duration: 280,
                        delay: 160,
                        easing: 'easeOutQuad',
                    });
                } else if (wasActive) {
                    anime.remove([btn, label]);
                    anime({
                        targets: label,
                        opacity: [1, 0],
                        translateX: ['0px', '-8px'],
                        duration: 160,
                        easing: 'easeInQuad',
                    });
                    anime({
                        targets: btn,
                        paddingLeft: ['10px', '0px'],
                        paddingRight: ['10px', '0px'],
                        delay: 80,
                        duration: 300,
                        easing: 'easeInOutQuart',
                    });
                }
            });
        });
    }, [activeShell]);

    return (
        <div 
            className="shell-navigator-container"
            style={{
                position: 'absolute',
                left: 28,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                pointerEvents: 'auto',
            }}
        >
            {SHELLS.map(({ level, label, color, colorRgb }) => {
                const isActive = activeShell === level;
                return (
                    <button
                        key={level}
                        ref={el => { btnRefs.current[level] = el; }}
                        onClick={() => { if (!isAnimating) onShellChange?.(level); }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: isActive ? 'flex-start' : 'center',
                            gap: 8,
                            width: isActive ? 'auto' : '36px',
                            height: '36px',
                            paddingLeft: isActive ? '10px' : '0px',
                            paddingRight: isActive ? '10px' : '0px',
                            borderRadius: '999px',
                            border: `1.5px solid rgba(${colorRgb}, ${isActive ? '0.4' : '0.25'})`,
                            background: isActive
                                ? `rgba(${colorRgb}, 0.10)`
                                : 'rgba(255,255,255,0.15)',
                            backdropFilter: 'blur(8px)',
                            boxShadow: isActive ? `0 2px 14px rgba(${colorRgb},0.18)` : 'none',
                            cursor: isAnimating ? 'default' : 'pointer',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            outline: 'none',
                            transition: 'border-color 0.35s, background 0.35s, box-shadow 0.35s',
                        }}
                    >
                        <span
                            ref={el => { dotRefs.current[level] = el; }}
                            style={{
                                display: 'inline-block',
                                width: 9,
                                height: 9,
                                borderRadius: '50%',
                                background: color,
                                flexShrink: 0,
                                boxShadow: isActive ? `0 0 7px 2px rgba(${colorRgb},0.45)` : 'none',
                                transition: 'box-shadow 0.35s',
                            }}
                        />
                        <span
                            ref={el => { labelRefs.current[level] = el; }}
                            style={{
                                fontFamily: "'Fragment Mono', 'Courier Prime', monospace",
                                fontSize: '9px',
                                letterSpacing: '1.8px',
                                color: color,
                                opacity: isActive ? 1 : 0,
                                pointerEvents: 'none',
                                userSelect: 'none',
                            }}
                        >
                            {label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
```

## File: src/components/onboarding/OnboardingFlow.tsx
```tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { OnboardingFilm } from "@/app/onboarding/page";

/* ─── Constants ─────────────────────────────────────────────────── */
const FONTS_URL = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Courier+Prime:ital,wght@0,400;0,700;1,400&display=swap";
const MAX_PILLARS = 6;

type Reaction = "loved" | "disliked" | "seen" | "unseen";
type Phase = "welcome" | "step" | "confirm" | "done";

interface OnboardingFlowProps {
  films: OnboardingFilm[];
}

/* ─── Helpers ───────────────────────────────────────────────────── */
function useIsMobile() {
  const [mobile, setMobile] = useState<boolean | undefined>(undefined);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return mobile;
}

export default function OnboardingFlow({ films }: OnboardingFlowProps) {
  const isMobile = useIsMobile();

  // Split films into 3 groups based on onboarding_group
  const STEPS = [
    films.filter(f => f.onboarding_group === 1),
    films.filter(f => f.onboarding_group === 2),
    films.filter(f => f.onboarding_group === 3),
  ];

  const [phase, setPhase] = useState<Phase>("welcome");
  const [currentStep, setCurrentStep] = useState(0);
  const [filmIndex, setFilmIndex] = useState(0);
  const [reactions, setReactions] = useState<Record<number, Reaction>>({});
  const [pillars, setPillars] = useState<OnboardingFilm[]>([]);
  const [cardAnim, setCardAnim] = useState("idle");
  const [stepDone, setStepDone] = useState(false);
  const [replacingPillar, setReplacingPillar] = useState<number | null>(null);
  const [fadeIn, setFadeIn] = useState(true);
  const [dragItem, setDragItem] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [isSideboardOpen, setIsSideboardOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const lovedFilms = films.filter(f => reactions[f.id] === "loved");
  const stepFilms = STEPS[currentStep] || [];
  const currentFilm = stepFilms[filmIndex];
  const isLastStep = currentStep === STEPS.length - 1;
  const allReacted = stepFilms.every(f => reactions[f.id]);

  /* ─── Transition helpers ──────────────────────────────────────── */
  const pageTransition = useCallback((fn: () => void) => {
    setFadeIn(false);
    setTimeout(() => { fn(); setFadeIn(true); }, 280);
  }, []);

  function animateCard(type: string, afterFn: () => void) {
    setCardAnim(`exit-${type}`);
    setTimeout(() => {
      afterFn();
      setCardAnim("enter");
      setTimeout(() => setCardAnim("idle"), 320);
    }, 260);
  }

  /* ─── Reaction handler ────────────────────────────────────────── */
  function handleReaction(key: Reaction) {
    if (stepDone) return;
    const film = currentFilm;
    animateCard(key, () => {
      const updated = { ...reactions, [film.id]: key };
      setReactions(updated);
      const isLastFilm = filmIndex === stepFilms.length - 1;
      if (isLastFilm) {
        setTimeout(() => setStepDone(true), 80);
      } else {
        setFilmIndex(i => i + 1);
      }
    });
  }

  /* ─── Navigation ──────────────────────────────────────────────── */
  function navigateTo(idx: number) {
    if (idx < 0 || idx >= stepFilms.length) return;
    if (stepDone) {
      setStepDone(false);
      setFilmIndex(idx);
      setCardAnim("enter");
      setTimeout(() => setCardAnim("idle"), 300);
      return;
    }
    const dir = idx > filmIndex ? "nav-fwd" : "nav-bck";
    setCardAnim(`exit-${dir}`);
    setTimeout(() => {
      setFilmIndex(idx);
      setCardAnim("enter");
      setTimeout(() => setCardAnim("idle"), 300);
    }, 220);
  }

  function handleNextStep() {
    if (!isLastStep) {
      pageTransition(() => {
        setCurrentStep(s => s + 1);
        setFilmIndex(0);
        setStepDone(false);
        setCardAnim("enter");
        setTimeout(() => setCardAnim("idle"), 350);
      });
    } else {
      const selected = lovedFilms.slice(0, MAX_PILLARS);
      setPillars(selected);
      pageTransition(() => setPhase("confirm"));
    }
  }

  /* ─── Touch swipe ─────────────────────────────────────────────── */
  function onTouchStart(e: React.TouchEvent) { touchStartX.current = e.touches[0].clientX; }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 48) return;
    handleReaction(dx > 0 ? "loved" : "disliked");
  }

  /* ─── Drag & Drop ─────────────────────────────────────────────── */
  function onDragStart(idx: number) { setDragItem(idx); }
  function onDragEnter(idx: number) { setDragOver(idx); }
  function onDragEnd() {
    // Clear regardless of success
    setTimeout(() => {
      setDragItem(null); setDragOver(null);
      delete (window as any)._draggedSidebarFilm;
    }, 50);
  }

  function onDrop(idx: number) {
    console.log("Drop triggered on index:", idx, "from item:", dragItem);
    if (dragItem !== null) {
      if (dragItem === -1) {
        const film = (window as any)._draggedSidebarFilm;
        if (film) {
          const next = [...pillars];
          next[idx] = film;
          setPillars(next);
        }
      } else if (dragItem !== idx) {
        const next = [...pillars];
        const [r] = next.splice(dragItem, 1);
        next.splice(idx, 0, r);
        setPillars(next);
      }
    }
  }

  function handleReplace(idx: number, film: OnboardingFilm) {
    const next = [...pillars]; next[idx] = film; setPillars(next);
    setReplacingPillar(null);
  }

  const replacementCandidates = lovedFilms.filter(f => !pillars.find(p => p.id === f.id));

  /* ─── Save & Confirm ──────────────────────────────────────────── */
  async function handleConfirm() {
    setSaving(true);
    try {
      const result = {
        pillars: pillars.map((p, i) => ({
          filmId: p.id,
          title: p.title,
          rank: i + 1,
        })),
        reactions, // Use the raw object {id: reaction}

        timestamp: new Date().toISOString(),
      };

      // Save via API route
      const res = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error("Failed to save onboarding results:", res.status, errData);
        alert(`Errore di salvataggio [${res.status}]: ${errData.error || res.statusText}`);
        setSaving(false);
        return;
      }

      console.log("Onboarding saved successfully, status:", res.status);

      setSaving(false);
      pageTransition(() => setPhase("done"));
    } catch (err) {
      console.error("Error saving onboarding:", err);
      alert("Errore di rete durante il salvataggio.");
      setSaving(false);
    }
  }

  /* ─── Card animation style ────────────────────────────────────── */
  const cardStyle = (() => {
    const t = "opacity 0.22s ease, transform 0.22s ease";
    if (cardAnim === "exit-loved") return { opacity: 0, transform: "translateX(70px) rotate(8deg)", transition: t };
    if (cardAnim === "exit-disliked") return { opacity: 0, transform: "translateX(-70px) rotate(-8deg)", transition: t };
    if (cardAnim === "exit-seen") return { opacity: 0, transform: "translateY(-40px) scale(0.96)", transition: t };
    if (cardAnim === "exit-unseen") return { opacity: 0, transform: "translateY(-40px) scale(0.96)", transition: t };
    if (cardAnim === "exit-nav-fwd") return { opacity: 0, transform: "translateX(-32px)", transition: t };
    if (cardAnim === "exit-nav-bck") return { opacity: 0, transform: "translateX(32px)", transition: t };
    if (cardAnim === "enter") return { opacity: 0, transform: "translateY(12px)", transition: "none" };
    return { opacity: 1, transform: "none", transition: t };
  })();

  const progressPct = (filmIndex / stepFilms.length) * 100;

  /* ─── Card background: poster or gradient ─────────────────────── */
  function filmCardBg(film: OnboardingFilm): React.CSSProperties {
    if (film.poster_url) {
      return {
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.55) 100%), url(${film.poster_url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }
    return {
      background: `linear-gradient(155deg, ${film.color_primary} 0%, ${film.color_accent}60 55%, ${film.color_primary}EE 100%)`,
    };
  }

  function filmGradient(film: OnboardingFilm): React.CSSProperties {
    if (film.poster_url) {
      return {
        backgroundImage: `url(${film.poster_url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }
    return {
      background: `linear-gradient(155deg, ${film.color_primary} 0%, ${film.color_accent}66 70%, ${film.color_primary} 100%)`,
    };
  }

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="ob-root ob-faded"></div>;
  }

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href={FONTS_URL} />
      <style>{ONBOARDING_CSS}</style>

      <div className={`ob-root${!fadeIn ? " ob-faded" : ""}`}>

        {/* ═══ WELCOME ═══ */}
        {phase === "welcome" && (
          <div className="ob-welcome">
            <div className="ob-eyebrow">Semantic Sphere · Onboarding</div>
            <h1 className="ob-w-title">I tuoi<br /><em>pilastri</em><br />del gusto</h1>
            <div className="ob-divider" />
            <p className="ob-w-sub">Ogni film che ami è una porta.<br />Mostraci le tue porte.</p>
            <p className="ob-w-desc">
              Ti mostreremo 15 film in tre gruppi.<br />
              Dicci cosa ami, cosa non fa per te,<br />
              cosa non hai ancora visto.
            </p>
            <button className="ob-btn-p" onClick={() => pageTransition(() => setPhase("step"))}>
              Inizia →
            </button>
          </div>
        )}

        {/* ═══ STEP ═══ */}
        {phase === "step" && (
          <div className="ob-step-shell">
            {/* topbar */}
            <div className="ob-topbar">
              <div className="ob-brand">La <em>Sfera</em> Semantica</div>
              <div className="ob-step-meta">
                <div className="ob-step-dots">
                  {STEPS.map((_, i) => (
                    <div key={i} className={`ob-sdot ${i < currentStep ? "done" : i === currentStep ? "active" : ""}`} />
                  ))}
                </div>
                <div className="ob-step-lbl">Gruppo {currentStep + 1}/{STEPS.length}</div>
              </div>
            </div>

            {/* progress bar */}
            <div className="ob-pbar">
              <div className="ob-pbar-fill" style={{ width: stepDone ? "100%" : `${progressPct}%` }} />
            </div>

            {/* card stage */}
            <div className="ob-stage">
              <div className="ob-stage-headline">
                <h2>
                  {stepDone
                    ? <><em>Gruppo {currentStep + 1}</em> completato</>
                    : currentStep === 0 ? <>Questo film <em>ti appartiene?</em></>
                      : currentStep === 1 ? <>Ti <em>riconosce?</em></>
                        : <><em>Sii onesto.</em></>
                  }
                </h2>
                <p>
                  {stepDone
                    ? `${stepFilms.filter(f => reactions[f.id] === "loved").length} amati · clicca un punto per tornare`
                    : `${filmIndex + 1} di ${stepFilms.length} · gruppo ${currentStep + 1}`
                  }
                </p>
              </div>

              <div className="ob-card-wrap">
                {/* completion card */}
                {stepDone ? (
                  <div className="ob-done-card-sizer">
                    <div className="ob-done-card">
                      <div className="ob-done-card-check">✓</div>
                      <div className="ob-done-card-label">
                        tutti i film<br />valutati
                      </div>
                    </div>
                  </div>
                ) : currentFilm ? (
                  <>
                    {/* film card */}
                    <div className="ob-film-card-sizer" style={cardStyle}>
                      <div
                        className="ob-film-card"
                        onTouchStart={onTouchStart}
                        onTouchEnd={onTouchEnd}
                      >
                        <div className="ob-fc-bg" style={filmCardBg(currentFilm)} />
                        <div className="ob-fc-info">
                          <div className="ob-fc-mood">{currentFilm.mood}</div>
                          <div>
                            <div className="ob-fc-title">{currentFilm.title}</div>
                            <div className="ob-fc-dir">{currentFilm.director} · {currentFilm.year}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* swipe hint mobile */}
                    {isMobile === true && <div className="ob-swipe-hint">swipe per valutare · frecce per navigare</div>}
                  </>
                ) : null}

                {/* nav arrows + dot trail */}
                <div className="ob-nav-arrows">
                  <button
                    className="ob-nav-arrow"
                    disabled={!stepDone && filmIndex === 0}
                    onClick={() => stepDone ? navigateTo(stepFilms.length - 1) : navigateTo(filmIndex - 1)}
                  >←</button>
                  <div className="ob-nav-center">
                    <div className="ob-f-dots">
                      {stepFilms.map((f, i) => {
                        const r = reactions[f.id];
                        const isCur = !stepDone && i === filmIndex;
                        const cls = isCur ? "cur" : r === "loved" ? "loved" : r === "disliked" ? "disliked" : r === "unseen" ? "unseen" : "";
                        return (
                          <div key={f.id} className={`ob-fdot ${cls}`} style={{ cursor: "pointer" }} onClick={() => navigateTo(i)} title={f.title} />
                        );
                      })}
                    </div>
                  </div>
                  <button
                    className="ob-nav-arrow"
                    disabled={!stepDone && filmIndex === stepFilms.length - 1}
                    onClick={() => navigateTo(filmIndex + 1)}
                  >→</button>
                </div>

                {/* reaction buttons */}
                {!stepDone && (
                  <div className="ob-rxn-row">
                    <button className="ob-rxn-btn loved" onClick={() => handleReaction("loved")}>
                      <span className="ob-rxn-icon" style={{ color: "var(--ob-gold)" }}>♥</span>
                      <span className="ob-rxn-lbl">L&apos;ho<br />amato</span>
                    </button>
                    <button className="ob-rxn-btn disliked" onClick={() => handleReaction("disliked")}>
                      <span className="ob-rxn-icon" style={{ color: "var(--ob-ink-light)" }}>✕</span>
                      <span className="ob-rxn-lbl">Non fa<br />per me</span>
                    </button>

                    <div className="ob-rxn-split">
                      <div className="ob-rxn-split-bg seen-bg" />
                      <div className="ob-rxn-split-bg unseen-bg" />
                      <div className="ob-rxn-split-line" />

                      <span className="ob-rxn-split-lbl seen-lbl">Visto</span>
                      <span className="ob-rxn-split-lbl unseen-lbl">Non visto</span>

                      <button className="ob-rxn-split-hit seen-hit" onClick={() => handleReaction("seen")} />
                      <button className="ob-rxn-split-hit unseen-hit" onClick={() => handleReaction("unseen")} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* bottom bar */}
            <div className="ob-botbar">
              <div className="ob-loved-row">
                <div className="ob-loved-txt">
                  {stepFilms.filter(f => reactions[f.id] === "loved").length > 0
                    ? `${stepFilms.filter(f => reactions[f.id] === "loved").length} ♥ in questo gruppo`
                    : "nessun film amato ancora"}
                </div>
              </div>
              <div className="ob-botright">
                {!stepDone && !allReacted && (
                  <div className="ob-nudge">valuta tutti i film per continuare</div>
                )}
                <button
                  className={`ob-btn-cont ${allReacted || stepDone ? "on" : "off"}`}
                  disabled={!allReacted && !stepDone}
                  onClick={handleNextStep}
                >
                  {isLastStep ? "Vedi il riepilogo →" : "Prossimo gruppo →"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══ CONFIRM — PYRAMID ═══ */}
        {phase === "confirm" && (() => {
          const rows = [
            pillars.slice(0, 1),
            pillars.slice(1, 3),
            pillars.slice(3, 6),
          ].filter(r => r.length > 0);

          return (
            <div className="ob-pyramid-shell">
              {/* Toggle Sidebar Button */}
              <button
                className={`ob-side-toggle ${isSideboardOpen ? 'open' : ''}`}
                onClick={() => setIsSideboardOpen(!isSideboardOpen)}
                title={isSideboardOpen ? "Chiudi galleria" : "Apri galleria film amati"}
              >
                <span className="ob-side-toggle-icon">‹</span>
              </button>

              {replacingPillar !== null && (
                <div className="ob-rep-overlay">
                  <h3 className="ob-rep-title">Scegli il <em>sostituto</em></h3>
                  <div className="ob-rep-sub">Film che hai amato · non ancora nei pilastri</div>
                  <div className="ob-rep-grid">
                    {replacementCandidates.length === 0
                      ? <p className="ob-rep-empty">Nessun candidato disponibile</p>
                      : replacementCandidates.map(film => (
                        <div key={film.id} className="ob-rep-card" onClick={() => handleReplace(replacingPillar, film)}>
                          <div className="ob-rep-card-poster">
                            <div style={{ ...filmGradient(film), width: "100%", height: "100%", display: "flex", alignItems: "flex-end", padding: "10px 8px" }}>
                              <span style={{ fontFamily: "var(--ob-serif)", fontSize: "11px", color: "#fff", lineHeight: 1.3 }}>{film.title}</span>
                            </div>
                          </div>
                          <div className="ob-rep-ct">{film.title}</div>
                          <div className="ob-rep-cy">{film.year}</div>
                        </div>
                      ))
                    }
                  </div>
                  <button className="ob-btn-g" onClick={() => setReplacingPillar(null)}>Annulla</button>
                </div>
              )}

              <div className={`ob-confirm-container ${isSideboardOpen ? 'side-open' : ''}`}>
                <div className="ob-pyramid-main">
                  <div className="ob-pyr-header">
                    <div>
                      <h2 className="ob-pyr-title">Il tuo<br /><em>profilo</em></h2>
                      <div className="ob-pyr-sub">Trascina per riordinare · hover per sostituire</div>
                    </div>
                    <div className="ob-pyr-hint">
                      Il vertice è<br />il tuo centro.<br />L&apos;ordine conta.
                    </div>
                  </div>

                  {pillars.length === 0 ? (
                    <div className="ob-pyr-empty">
                      <div className="ob-pyr-empty-title">Nessun film <em>amato</em></div>
                      <div className="ob-pyr-empty-sub">
                        Torna indietro e seleziona<br />almeno un film che ti ha colpito.
                      </div>
                    </div>
                  ) : (
                    <div className="ob-pyramid">
                      {rows.map((row, rowIdx) => (
                        <div key={rowIdx} className={`ob-pyr-row row-${rowIdx}`}>
                          {row.map((film) => {
                            const globalIdx = pillars.indexOf(film);
                            return (
                              <div
                                key={film.id}
                                className={`ob-pyr-card ${dragItem === globalIdx ? "drag-src" : ""} ${dragOver === globalIdx ? "drag-tgt" : ""}`}
                                data-rank={globalIdx}
                                draggable
                                onDragStart={() => onDragStart(globalIdx)}
                                onDragEnter={() => onDragEnter(globalIdx)}
                                onDragEnd={onDragEnd}
                                onDragOver={e => e.preventDefault()}
                                onDrop={() => onDrop(globalIdx)}
                              >
                                <div className="ob-pyr-rank-lbl">
                                  {globalIdx === 0 ? "▲ vertice" : `n° ${globalIdx + 1}`}
                                </div>
                                <div className="ob-pyr-poster">
                                  <div className="ob-pyr-poster-inner" style={filmGradient(film)}>
                                    <span className="ob-pyr-poster-title">{film.title}</span>
                                  </div>
                                  <button className="ob-pyr-rep" onClick={() => setReplacingPillar(globalIdx)}>↔ Sostituisci</button>
                                </div>
                                <div className="ob-pyr-name">{film.title}</div>
                                <div className="ob-pyr-meta">{film.director} · {film.year}</div>
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="ob-pyr-foot">
                    <div className="ob-pyr-count">
                      {pillars.length} {pillars.length === 1 ? "pilastro" : "pilastri"} · pronto per la sfera
                    </div>
                    <button className="ob-btn-p" onClick={handleConfirm} disabled={saving}>
                      {saving ? "Salvataggio..." : "Entra nella Sfera →"}
                    </button>
                  </div>
                </div>

                {/* Sidebar per altri film amati (Sliding) */}
                <div className={`ob-pyr-sidebar ${isSideboardOpen ? 'active' : ''}`}>
                  <div className="ob-side-header">
                    <h3 className="ob-side-title">Altri <em>preferiti</em></h3>
                    <p className="ob-side-sub">Film che hai amato</p>
                  </div>
                  <div className="ob-side-grid">
                    {replacementCandidates.length === 0 ? (
                      <p className="ob-side-empty">Nessun altro film amato</p>
                    ) : (
                      replacementCandidates.map(film => (
                        <div
                          key={film.id}
                          className="ob-side-card"
                          draggable
                          onDragStart={() => {
                            // logic to treat this as a "virtual" index or handle specifically
                            setDragItem(-1); // special mark for sidebar items?
                            // Actually, let's just make it possible to swap the dragged item with a pillar
                            (window as any)._draggedSidebarFilm = film;
                          }}
                          onClick={() => setReplacingPillar(pillars.length - 1)}
                        >
                          <div className="ob-side-poster" style={filmGradient(film)}>
                            <span className="ob-side-poster-title">{film.title}</span>
                          </div>
                          <div className="ob-side-meta">
                            <div className="ob-side-name">{film.title}</div>
                            <div className="ob-side-year">{film.year}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ═══ DONE ═══ */}
        {phase === "done" && (
          <div className="ob-done">
            <div className="ob-eyebrow ob-au0">Onboarding completato</div>
            <h2 className="ob-done-title">La tua <em>Sfera</em><br />è pronta</h2>
            <p className="ob-done-body">
              I tuoi {pillars.length} pilastri del gusto sono stati registrati.
              Il grafo editoriale costruirà attorno a loro una costellazione di film
              connessi da fili invisibili ma precisi.
            </p>
            <div className="ob-done-thumbs">
              {pillars.map(film => (
                <div key={film.id} className="ob-done-thumb">
                  <div style={{ ...filmGradient(film), width: "100%", height: "100%" }} />
                </div>
              ))}
            </div>
            <button className="ob-btn-p" onClick={() => {
              console.log("Navigating to sphere...");
              setSaving(true);
              setTimeout(() => {
                window.location.href = "/sphere?completed=true";
              }, 800);
            }}>
              Entra nella Sfera →
            </button>
          </div>
        )}

      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   CSS — prefixed with 'ob-' to avoid class collisions with the rest
   of the app. Ported from beta1.jsx with minimal changes.
   ═══════════════════════════════════════════════════════════════════ */
const ONBOARDING_CSS = `
*, *::before, *::after { box-sizing: border-box; }
:root {
  --ob-cream:      #F2EDE3;
  --ob-cream-dark: #E4DBCC;
  --ob-ink:        #1A1614;
  --ob-ink-light:  #4A4440;
  --ob-ink-faint:  #9A9490;
  --ob-gold:       #B8895A;
  --ob-gold-light: #D4A870;
  --ob-gold-faint: rgba(184,137,90,0.15);
  --ob-serif:      'Cormorant Garamond', Georgia, serif;
  --ob-mono:       'Courier Prime', monospace;
  --ob-r:          3px;
}

.ob-root {
  min-height: 100vh;
  background: var(--ob-cream);
  font-family: var(--ob-serif);
  color: var(--ob-ink);
  position: relative;
  overflow-x: hidden;
  transition: opacity 0.28s ease;
}
.ob-root.ob-faded { opacity: 0; pointer-events: none; }

/* subtle texture */
.ob-root::after {
  content: ''; position: fixed; inset: 0;
  pointer-events: none; z-index: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
}

/* ── WELCOME ── */
.ob-welcome {
  position: relative; z-index: 1;
  min-height: 100vh;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: clamp(40px,10vw,88px) clamp(24px,6vw,64px);
  text-align: center;
}
.ob-eyebrow {
  font-family: var(--ob-mono);
  font-size: clamp(9px,1.5vw,11px);
  letter-spacing: 0.28em; text-transform: uppercase;
  color: var(--ob-gold);
  margin-bottom: clamp(20px,4vh,36px);
  animation: ob-au 0.55s ease both;
}
.ob-w-title {
  font-size: clamp(48px,10vw,96px);
  font-weight: 300; line-height: 1.02;
  letter-spacing: -0.025em;
  margin: 0 0 10px 0;
  animation: ob-au 0.55s 0.08s ease both;
}
.ob-w-title em { font-style: italic; color: var(--ob-gold); }
.ob-divider {
  width: 32px; height: 1px; background: var(--ob-gold);
  margin: clamp(18px,3vh,32px) auto;
  animation: ob-au 0.55s 0.16s ease both;
}
.ob-w-sub {
  font-size: clamp(15px,2.5vw,20px); font-weight: 300;
  color: var(--ob-ink-light); max-width: 460px;
  line-height: 1.65; margin: 0 0 clamp(14px,2vh,24px) 0;
  animation: ob-au 0.55s 0.16s ease both;
}
.ob-w-desc {
  font-family: var(--ob-mono);
  font-size: clamp(9px,1.4vw,10px);
  letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--ob-ink-faint); max-width: 320px;
  line-height: 1.9; margin: 0 0 clamp(36px,6vh,60px) 0;
  animation: ob-au 0.55s 0.24s ease both;
}

/* ── BOTTOM BAR ── */
.ob-botbar {
  display: flex; justify-content: space-between; align-items: center;
  margin-top: auto; padding-top: clamp(24px,4vh,40px);
  border-top: 1px solid rgba(0,0,0,0.06); gap: 16px;
}
.ob-loved-row { display: flex; align-items: center; gap: 8px; font-family: var(--ob-mono); font-size: 9px; letter-spacing: 0.1em; color: var(--ob-ink-faint); text-transform: uppercase; }
.ob-botright {
  display: flex; flex-direction: row; align-items: center; justify-content: flex-end; gap: 16px; text-align: right; flex-wrap: nowrap; white-space: nowrap;
}

/* ── BUTTONS ── */
.ob-btn-p {
  font-family: var(--ob-mono);
  font-size: clamp(10px,1.5vw,12px);
  letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--ob-cream); background: var(--ob-ink);
  border: none; cursor: pointer; border-radius: var(--ob-r);
  padding: clamp(14px,2vh,18px) clamp(36px,5vw,56px);
  transition: background 0.22s, transform 0.12s;
  animation: ob-au 0.55s 0.32s ease both;
}
.ob-btn-p:hover  { background: var(--ob-gold); }
.ob-btn-p:active { transform: scale(0.97); }
.ob-btn-p:disabled { opacity: 0.5; cursor: wait; }

.ob-btn-g {
  font-family: var(--ob-mono);
  font-size: clamp(9px,1.3vw,11px);
  letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--ob-ink-faint); background: transparent;
  border: 1px solid var(--ob-cream-dark);
  cursor: pointer; border-radius: var(--ob-r);
  padding: clamp(12px,1.8vh,16px) clamp(28px,4vw,44px);
  transition: border-color 0.2s, color 0.2s, transform 0.12s;
}
.ob-btn-g:hover  { border-color: var(--ob-ink-faint); color: var(--ob-ink); }

/* ── STEP SHELL ── */
.ob-step-shell {
  position: relative; z-index: 1;
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 2px 1fr auto;
}
.ob-topbar {
  display: flex; justify-content: space-between; align-items: center;
  padding: clamp(16px,2.5vh,28px) clamp(20px,5vw,56px);
  border-bottom: 1px solid var(--ob-cream-dark);
}
.ob-brand { font-size: clamp(13px,2vw,16px); }
.ob-brand em { font-style: italic; color: var(--ob-gold); }
.ob-step-meta { display: flex; align-items: center; gap: 14px; }
.ob-step-dots { display: flex; gap: 7px; }
.ob-sdot {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--ob-cream-dark); transition: background 0.2s;
}
.ob-sdot.active { background: var(--ob-gold); }
.ob-sdot.done   { background: var(--ob-ink-faint); }
.ob-step-lbl {
  font-family: var(--ob-mono);
  font-size: clamp(8px,1.2vw,10px);
  letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--ob-ink-faint);
}

/* progress bar */
.ob-pbar { background: var(--ob-cream-dark); height: 2px; }
.ob-pbar-fill { height: 100%; background: var(--ob-gold); transition: width 0.35s ease; }

/* ── CARD STAGE ── */
.ob-stage {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: clamp(10px,2vh,20px) clamp(20px,5vw,56px);
  gap: clamp(12px,2vh,20px);
}
.ob-stage-headline { text-align: center; }
.ob-stage-headline h2 {
  font-size: clamp(20px,4vw,36px); font-weight: 300;
  letter-spacing: -0.01em; line-height: 1.15; margin: 0 0 6px 0;
}
.ob-stage-headline h2 em { font-style: italic; color: var(--ob-gold); }
.ob-stage-headline p {
  font-family: var(--ob-mono);
  font-size: clamp(8px,1.2vw,10px);
  letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--ob-ink-faint); margin: 0;
}

.ob-card-wrap {
  display: flex; flex-direction: column;
  align-items: center;
  gap: clamp(14px,2vh,22px);
  width: 100%;
}

.ob-film-card-sizer {
  height: clamp(200px, 40vh, 380px);
  aspect-ratio: 2/3;
  flex-shrink: 0;
  position: relative;
}

.ob-film-card {
  width: 100%; height: 100%;
  border-radius: 4px; overflow: hidden;
  position: relative;
  box-shadow: 0 20px 56px rgba(0,0,0,0.16), 0 4px 14px rgba(0,0,0,0.08);
  user-select: none;
  transition: transform 0.22s ease;
}
.ob-film-card:hover { transform: translateY(-3px) scale(1.005); }

.ob-fc-bg { position: absolute; inset: 0; }
.ob-fc-info {
  position: absolute; inset: 0;
  display: flex; flex-direction: column;
  justify-content: space-between;
  padding: clamp(12px,3%,18px);
}
.ob-fc-mood {
  font-family: var(--ob-mono);
  font-size: clamp(7px,1vw,9px);
  letter-spacing: 0.15em; text-transform: uppercase;
  color: rgba(255,255,255,0.38); line-height: 1.6;
}
.ob-fc-title {
  font-family: var(--ob-serif);
  font-size: clamp(18px,3.5vw,28px); font-weight: 400;
  color: #fff; line-height: 1.2; margin-bottom: 4px;
}
.ob-fc-dir {
  font-family: var(--ob-mono);
  font-size: clamp(7px,1vw,9px);
  letter-spacing: 0.16em; text-transform: uppercase;
  color: rgba(255,255,255,0.45);
}

/* dot trail */
.ob-f-dots { display: flex; gap: 7px; justify-content: center; }
.ob-fdot {
  width: 5px; height: 5px; border-radius: 50%;
  background: var(--ob-cream-dark); transition: background 0.2s, transform 0.2s;
}
.ob-fdot.cur     { background: var(--ob-gold); transform: scale(1.4); }
.ob-fdot.loved   { background: var(--ob-gold-light); }
.ob-fdot.disliked{ background: var(--ob-ink-faint); }
.ob-fdot.unseen  { background: var(--ob-cream-dark); outline: 1px solid var(--ob-ink-faint); outline-offset: 1px; }

.ob-swipe-hint {
  font-family: var(--ob-mono);
  font-size: 9px; letter-spacing: 0.18em;
  text-transform: uppercase; color: var(--ob-ink-faint);
}

/* ── REACTION BUTTONS ── */
.ob-rxn-row {
  display: flex; flex-direction: row;
  justify-content: center; align-items: stretch;
  gap: clamp(10px,2vw,16px);
  width: 100%; max-width: 480px; margin: 0 auto;
}
.ob-rxn-btn {
  flex: 1; min-width: 110px; max-width: 130px;
  height: 88px;
  background: transparent; border: 1.5px solid var(--ob-cream-dark);
  border-radius: 4px; padding: 12px 6px; cursor: pointer;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;
  transition: border-color 0.18s, background 0.18s;
}
.ob-rxn-icon {
  font-size: clamp(16px,2vw,20px); line-height: 1;
  transition: transform 0.14s;
}
.ob-rxn-lbl {
  font-family: var(--ob-mono); font-size: 8px; font-weight: 500;
  letter-spacing: 0.18em; text-transform: uppercase; line-height: 1.25;
  color: var(--ob-ink-light); text-align: center;
}
.ob-rxn-btn.loved   { border-color: var(--ob-gold-faint); }
.ob-rxn-btn.loved:hover   { background: var(--ob-gold); border-color: var(--ob-gold); }
.ob-rxn-btn.loved:hover .ob-rxn-icon { transform: scale(1.2); color: var(--ob-cream) !important; }
.ob-rxn-btn.loved:hover .ob-rxn-lbl  { color: rgba(255,255,255,0.75); }
.ob-rxn-btn.disliked:hover { background: var(--ob-ink); border-color: var(--ob-ink); }
.ob-rxn-btn.disliked:hover .ob-rxn-lbl, .ob-rxn-btn.disliked:hover .ob-rxn-icon { color: #fff !important; }
.ob-rxn-btn.unseen:hover  { background: var(--ob-cream-dark); }
.ob-rxn-btn:active { transform: scale(0.95); }

/* SPLIT BUTTON seen/unseen (Fixed & Polished) */
.ob-rxn-split {
  flex: 1; min-width: 110px; max-width: 130px;
  height: 88px;
  border-radius: 4px;
  border: 1.5px solid var(--ob-cream-dark);
  position: relative; overflow: hidden;
  background: transparent;
  transition: border-color 0.2s;
}

/* Backgrounds (Visual) */
.ob-rxn-split-bg {
  position: absolute; top:0; left:0; right:0; bottom:0;
  transition: clip-path 0.4s cubic-bezier(0.19, 1, 0.22, 1), background 0.4s;
  z-index: 1;
}
.seen-bg {
  clip-path: polygon(0 0, 100% 0, 0 100%);
  background: transparent;
}
.unseen-bg {
  clip-path: polygon(100% 0, 100% 100%, 0 100%);
  background: transparent;
}

/* Line (Visual) */
.ob-rxn-split-line {
  position: absolute; inset: 0;
  background: linear-gradient(to bottom right, transparent calc(50% - 1px), var(--ob-ink-light) calc(50% - 1px), var(--ob-ink-light) calc(50% + 1px), transparent calc(50% + 1px));
  z-index: 2; pointer-events: none;
  transition: transform 0.4s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.4s;
  opacity: 0.3;
}

/* Labels (Visual) */
.ob-rxn-split-lbl {
  position: absolute;
  font-family: var(--ob-mono); font-size: 8px; text-transform: uppercase;
  letter-spacing: 0.12em; color: var(--ob-ink-faint);
  z-index: 3; pointer-events: none;
  transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}
.seen-lbl {
  top: 14px; left: 14px; 
}
.unseen-lbl {
  bottom: 14px; right: 14px;
}

/* Hit Areas */
.ob-rxn-split-hit {
  position: absolute; inset: 0;
  border: none; background: transparent; cursor: pointer;
  z-index: 10;
}
.seen-hit {
  clip-path: polygon(0 0, 100% 0, 0 100%);
}
.unseen-hit {
  clip-path: polygon(100% 0, 100% 100%, 0 100%);
}

/* Hover States via container :has() */
.ob-rxn-split:hover {
  border-color: var(--ob-ink-faint);
}
.ob-rxn-split:has(.seen-hit:hover) {
  border-color: var(--ob-ink);
}
.ob-rxn-split:has(.seen-hit:hover) .seen-bg {
  clip-path: polygon(0 0, 200% 0, 0 200%);
  background: var(--ob-ink);
}
.ob-rxn-split:has(.seen-hit:hover) .ob-rxn-split-line {
  transform: translateX(100%); opacity: 0;
}
.ob-rxn-split:has(.seen-hit:hover) .seen-lbl {
  top: 50%; left: 50%; transform: translate(-50%, -50%);
  color: #fff;
}
.ob-rxn-split:has(.seen-hit:hover) .unseen-lbl {
  opacity: 0; transform: translate(20px, 20px);
}

.ob-rxn-split:has(.unseen-hit:hover) {
  border-color: var(--ob-cream-dark);
}
.ob-rxn-split:has(.unseen-hit:hover) .unseen-bg {
  clip-path: polygon(100% -100%, 100% 100%, -100% 100%);
  background: var(--ob-cream-dark);
}
.ob-rxn-split:has(.unseen-hit:hover) .ob-rxn-split-line {
  transform: translateX(-100%); opacity: 0;
}
.ob-rxn-split:has(.unseen-hit:hover) .unseen-lbl {
  bottom: 50%; right: 50%; transform: translate(50%, 50%);
  color: var(--ob-ink);
}
.ob-rxn-split:has(.unseen-hit:hover) .seen-lbl {
  opacity: 0; transform: translate(-20px, -20px);
}

/* ── BOTTOM BAR ── */
.ob-botbar {
  border-top: 1px solid var(--ob-cream-dark);
  padding: clamp(12px,2vh,20px) clamp(20px,5vw,56px);
  display: flex; align-items: center;
  justify-content: space-between; gap: 12px;
  flex-wrap: wrap;
}
.ob-loved-row { display: flex; align-items: center; gap: 10px; }
.ob-loved-txt {
  font-family: var(--ob-mono);
  font-size: clamp(8px,1.1vw,10px);
  letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--ob-ink-faint);
}
.ob-botright { display: flex; flex-direction: column; align-items: flex-end; gap: 5px; }
.ob-nudge {
  font-family: var(--ob-mono);
  font-size: 8px; letter-spacing: 0.16em;
  text-transform: uppercase; color: var(--ob-gold);
}
.ob-btn-cont {
  font-family: var(--ob-mono);
  font-size: clamp(9px,1.3vw,11px);
  letter-spacing: 0.2em; text-transform: uppercase;
  padding: clamp(11px,1.7vh,15px) clamp(22px,3vw,36px);
  border: none; cursor: pointer; border-radius: var(--ob-r);
  transition: background 0.2s, transform 0.12s;
}
.ob-btn-cont.on  { background: var(--ob-ink); color: var(--ob-cream); }
.ob-btn-cont.on:hover  { background: var(--ob-gold); }
.ob-btn-cont.off { background: var(--ob-cream-dark); color: var(--ob-ink-faint); cursor: not-allowed; }

/* ── PYRAMID ── */
.ob-pyramid-shell {
  position: relative; z-index: 1;
  min-height: 100vh;
  display: flex; flex-direction: column;
  padding: clamp(100px, 15vh, 160px) clamp(20px,4vw,48px) clamp(28px,5vw,56px);
  gap: clamp(20px,3vh,36px);
}
.ob-pyr-header {
  display: flex; justify-content: space-between;
  align-items: flex-end; flex-wrap: wrap; gap: 12px;
}
.ob-pyr-title {
  font-size: clamp(28px,5vw,52px); font-weight: 300;
  letter-spacing: -0.02em; line-height: 1.05; margin: 0;
}
.ob-pyr-title em { font-style: italic; color: var(--ob-gold); }
.ob-pyr-sub {
  font-family: var(--ob-mono);
  font-size: clamp(8px,1.1vw,10px);
  letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--ob-ink-faint); margin-top: 8px;
}
.ob-pyr-hint {
  font-family: var(--ob-mono);
  font-size: clamp(8px,1.1vw,10px);
  letter-spacing: 0.13em; text-transform: uppercase;
  color: var(--ob-ink-faint); line-height: 1.85;
  text-align: right;
}

.ob-pyramid {
  display: flex; flex-direction: column;
  align-items: center;
  gap: clamp(10px,1.8vh,18px);
  flex: 1; justify-content: center;
}
.ob-pyr-row {
  display: flex; gap: clamp(10px,1.8vw,18px);
  justify-content: center; align-items: flex-start;
}

.ob-pyr-card {
  cursor: grab; transition: transform 0.2s, opacity 0.2s;
  position: relative; flex-shrink: 0;
}
.ob-pyr-card:active { cursor: grabbing; }
.ob-pyr-card.drag-src { opacity: 0.28; transform: scale(0.94); }
.ob-pyr-card.drag-tgt { transform: scale(1.06); outline: 2px solid var(--ob-gold); border-radius: 3px; }

.ob-pyr-card { 
  width: clamp(100px, 12vw, 150px); 
}

/* Override per mantenere dimensioni uguali */
.ob-pyr-card[data-rank="0"],
.ob-pyr-card[data-rank="1"],
.ob-pyr-card[data-rank="2"],
.ob-pyr-card[data-rank="3"],
.ob-pyr-card[data-rank="4"],
.ob-pyr-card[data-rank="5"] { 
  width: clamp(100px, 12vw, 150px); 
}

.ob-pyr-rank-lbl {
  font-family: var(--ob-mono);
  font-size: clamp(7px,0.9vw,9px);
  letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--ob-gold);
  display: flex; align-items: center; gap: 5px;
  margin-bottom: 7px;
}
.ob-pyr-rank-lbl::after { content:''; flex:1; height:1px; background: var(--ob-gold-faint); }

.ob-pyr-poster {
  width: 100%; aspect-ratio: 2/3; border-radius: 3px;
  overflow: hidden; position: relative; margin-bottom: 8px;
}
.ob-pyr-poster-inner {
  width: 100%; height: 100%;
  display: flex; align-items: flex-end;
  padding: clamp(8px,2%,14px);
}
.ob-pyr-poster-title {
  font-family: var(--ob-serif);
  font-size: clamp(10px,1.4vw,13px);
  color: #fff; line-height: 1.3;
}
.ob-pyr-rep {
  position: absolute; bottom:0; left:0; right:0;
  font-family: var(--ob-mono); font-size: 8px;
  letter-spacing: 0.1em; text-transform: uppercase;
  text-align: center; padding: 7px;
  background: rgba(0,0,0,0.76); color: rgba(255,255,255,0.8);
  border: none; cursor: pointer; width: 100%;
  opacity: 0; transition: opacity 0.16s;
}
.ob-pyr-card:hover .ob-pyr-rep { opacity: 1; }
.ob-pyr-name { font-size: clamp(10px,1.3vw,13px); font-weight:400; line-height:1.3; margin-bottom:2px; }
.ob-pyr-meta { font-family:var(--ob-mono); font-size:clamp(7px,0.9vw,9px); letter-spacing:0.1em; color:var(--ob-ink-faint); text-transform:uppercase; }

.ob-pyr-empty { text-align: center; padding: clamp(40px,8vh,80px) 20px; }
.ob-pyr-empty-title { font-size: clamp(20px,3vw,32px); font-weight:300; margin:0 0 12px 0; }
.ob-pyr-empty-title em { font-style:italic; color:var(--ob-gold); }
.ob-pyr-empty-sub {
  font-family: var(--ob-mono);
  font-size: clamp(9px,1.2vw,11px);
  letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--ob-ink-faint); line-height: 1.8;
}

.ob-pyr-foot { display:flex; flex-direction:column; align-items:center; gap:12px; margin-top: 40px; }
.ob-pyr-count { font-family:var(--ob-mono); font-size:clamp(8px,1.1vw,10px); letter-spacing:0.22em; text-transform:uppercase; color:var(--ob-ink-faint); }

/* Layout Sideboard (Corrected for Center) */
.ob-confirm-container {
  display: flex;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  gap: 0;
  align-items: flex-start;
  justify-content: center; /* CENTER THE PYRAMID */
  position: relative;
  transition: padding-right 0.4s ease;
}
.ob-confirm-container.side-open {
  padding-right: 300px; /* offset when sidebar is fixed/absolute */
}

.ob-pyramid-main {
  flex: 0 1 auto;
  display: flex;
  flex-direction: column;
  gap: 40px;
  max-width: 900px;
  width: 100%;
}

.ob-side-toggle {
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 44px; height: 44px;
  border-radius: 50%;
  background: var(--ob-ink);
  color: #fff;
  border: none;
  cursor: pointer;
  z-index: 110;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  transition: transform 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}
.ob-side-toggle.open {
  transform: translateY(-50%) rotate(180deg) translateX(320px);
}
.ob-side-toggle-icon { font-size: 24px; line-height: 1; }

/* ── SIDEBAR ── */
.ob-pyr-sidebar {

  position: fixed; top: 0; right: 0; bottom: 0;
  width: 280px; background: rgba(242, 237, 227, 0.85);
  backdrop-filter: blur(24px);
  border-left: 1px solid var(--ob-cream-dark);
  transform: translateX(100%);
  transition: transform 0.6s cubic-bezier(0.19, 1, 0.22, 1);
  z-index: 1000;
  display: flex; flex-direction: column;
}
.ob-pyr-sidebar.active { transform: translateX(0); }

.ob-side-header { padding: 32px 24px 20px; border-bottom: 1px solid var(--ob-cream-dark); }
.ob-side-title  { font-size: 24px; font-weight: 300; margin: 0; }
.ob-side-title em { font-style: italic; color: var(--ob-gold); }
.ob-side-sub    { font-family: var(--ob-mono); font-size: 9px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--ob-ink-faint); margin: 6px 0 0; }

.ob-side-grid {
  flex: 1; overflow-y: auto;
  display: flex; flex-direction: column;
  gap: 24px; padding: 32px 24px;
}
.ob-side-card { 
  cursor: grab; transition: transform 0.2s; 
  display: flex; flex-direction: column; gap: 10px;
}
.ob-side-card:hover { transform: translateY(-4px); }
.ob-side-poster { 
  width: 100%; aspect-ratio: 2/3; border-radius: 4px; overflow: hidden;
  box-shadow: 0 12px 32px rgba(0,0,0,0.12);
  display: flex; align-items: flex-end; padding: 12px;
}
.ob-side-poster-title { color: #fff; font-size: 14px; opacity: 0; transition: opacity 0.2s; }
.ob-side-card:hover .ob-side-poster-title { opacity: 1; }

.ob-side-name { font-size: 16px; font-weight: 400; line-height: 1.2; }
.ob-side-year { font-family: var(--ob-mono); font-size: 9px; opacity: 0.5; margin-top: 2px; }

.ob-side-empty { font-family: var(--ob-mono); font-size: 10px; opacity: 0.4; text-align: center; margin-top: 40px; }
/* ── REPLACE OVERLAY ── */
.ob-rep-overlay {
  position: fixed; inset: 0;
  background: rgba(242,237,227,0.96);
  backdrop-filter: blur(6px);
  z-index: 300;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: clamp(28px,5vw,56px); gap: 0;
}
.ob-rep-title { font-size:clamp(26px,5vw,44px); font-weight:300; text-align:center; margin:0 0 8px 0; }
.ob-rep-title em { font-style:italic; color:var(--ob-gold); }
.ob-rep-sub { font-family:var(--ob-mono); font-size:clamp(8px,1.1vw,10px); letter-spacing:0.2em; text-transform:uppercase; color:var(--ob-ink-faint); margin-bottom:clamp(24px,4vh,44px); }
.ob-rep-grid { display:flex; gap:clamp(10px,2vw,18px); flex-wrap:wrap; justify-content:center; max-width:680px; margin-bottom:clamp(20px,3vh,36px); }
.ob-rep-card { width:clamp(90px,13vw,130px); cursor:pointer; transition:transform 0.16s; }
.ob-rep-card:hover { transform:translateY(-3px); }
.ob-rep-card-poster { width:100%; aspect-ratio:2/3; border-radius:3px; overflow:hidden; margin-bottom:7px; border:2px solid transparent; transition:border-color 0.16s; }
.ob-rep-card:hover .ob-rep-card-poster { border-color:var(--ob-gold); }
.ob-rep-ct { font-size:11px; line-height:1.3; margin-bottom:2px; }
.ob-rep-cy { font-family:var(--ob-mono); font-size:8px; letter-spacing:0.1em; color:var(--ob-ink-faint); text-transform:uppercase; }
.ob-rep-empty { font-family:var(--ob-mono); font-size:10px; letter-spacing:0.18em; color:var(--ob-ink-faint); text-transform:uppercase; }

/* ── DONE ── */
.ob-done {
  position: relative; z-index:1;
  min-height: 100vh;
  display: flex; flex-direction:column;
  align-items:center; justify-content:center;
  text-align:center;
  padding: clamp(100px, 15vh, 160px) clamp(24px,6vw,60px) clamp(60px, 10vh, 80px);
}
.ob-done-title { font-size:clamp(36px,8vw,80px); font-weight:300; letter-spacing:-0.025em; line-height:1.05; margin:0 0 18px 0; animation: ob-au 0.55s 0.08s ease both; }
.ob-done-title em { font-style:italic; color:var(--ob-gold); }
.ob-done-body { font-size:clamp(14px,2vw,17px); font-weight:300; color:var(--ob-ink-light); max-width:440px; line-height:1.75; margin:0 0 clamp(36px,5vh,56px) 0; animation: ob-au 0.55s 0.16s ease both; }
.ob-done-thumbs { display:flex; gap:clamp(8px,1.5vw,12px); justify-content:center; margin-bottom:clamp(36px,5vh,56px); animation: ob-au 0.55s 0.24s ease both; }
.ob-done-thumb { width:clamp(52px,7vw,72px); aspect-ratio:2/3; border-radius:3px; overflow:hidden; box-shadow:0 6px 20px rgba(0,0,0,0.1); }

/* ── COMPLETION CARD ── */
.ob-done-card-sizer {
  width: clamp(200px, 60vw, 280px);
  aspect-ratio: 2/3;
  flex-shrink: 0;
  animation: ob-au 0.4s ease both;
}
.ob-done-card {
  width: 100%; height: 100%;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 16px;
}
.ob-done-card-check {
  font-size: clamp(32px,5vw,48px);
  color: var(--ob-gold);
  line-height: 1;
  animation: ob-checkPop 0.4s 0.1s cubic-bezier(0.34,1.56,0.64,1) both;
}
.ob-done-card-label {
  font-family: var(--ob-mono);
  font-size: clamp(8px,1.1vw,10px);
  letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--ob-ink-faint); text-align: center;
  line-height: 1.8;
}
@keyframes ob-checkPop {
  from { opacity:0; transform: scale(0.4); }
  to   { opacity:1; transform: scale(1); }
}

/* ── NAV ARROWS ── */
.ob-nav-arrows {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 420px;
  padding: 0 4px;
}
.ob-nav-arrow {
  width: clamp(36px, 5vw, 44px);
  height: clamp(36px, 5vw, 44px);
  border-radius: 50%;
  border: 1.5px solid var(--ob-cream-dark);
  background: transparent;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: clamp(14px, 2vw, 18px);
  color: var(--ob-ink-light);
  transition: border-color 0.18s, background 0.18s, color 0.18s, transform 0.12s, opacity 0.18s;
  flex-shrink: 0;
}
.ob-nav-arrow:hover:not(:disabled) {
  border-color: var(--ob-gold);
  background: var(--ob-gold-faint);
  color: var(--ob-gold);
}
.ob-nav-arrow:active:not(:disabled) { transform: scale(0.93); }
.ob-nav-arrow:disabled { opacity: 0.22; cursor: not-allowed; }
.ob-nav-center { flex: 1; display: flex; justify-content: center; }

/* ── ANIMATIONS ── */
@keyframes ob-au {
  from { opacity:0; transform:translateY(14px); }
  to   { opacity:1; transform:none; }
}
.ob-au0 { animation: ob-au 0.5s ease both; }
`;

```

## File: src/lib/graph/traversal.ts
```ts
export interface FilmNode {
    id: number;
    title: string;
    year: number;
    dir: string;
    shell: number;
    tags: string[];
    poster?: string[];
    poster_url?: string | null;
}

export interface FilmEdge {
    from: number;
    to: number;
    type: string;
    label: string;
}

export interface NavContext {
    current: number;
    parent: number | null;
    siblings: number[];
    siblingIndex: number;
    children: number[];
    visible: Set<number>;
    stack: any[];
}

export function connectedTo(id: number, edges: FilmEdge[]): Set<number> {
    const s = new Set([id]);
    edges.forEach(e => {
        if (e.from === id) s.add(e.to);
        if (e.to === id) s.add(e.from);
    });
    return s;
}

export function edgesOf(id: number, edges: FilmEdge[]): number[] {
    return edges.reduce((a, e, i) => {
        if (e.from === id || e.to === id) a.push(i);
        return a;
    }, [] as number[]);
}

export function neighbors(id: number, shells: number[] | null, films: FilmNode[], edges: FilmEdge[]): number[] {
    const res: number[] = [];
    edges.forEach(e => {
        if (e.from === id && (shells === null || shells.includes(films[e.to].shell))) res.push(e.to);
        if (e.to === id && (shells === null || shells.includes(films[e.from].shell))) res.push(e.from);
    });
    return Array.from(new Set(res));
}

export function buildNavContext(
    filmIndex: number,
    parent: number | null = null,
    siblings: number[] | null = null,
    sibIdx: number = 0,
    stack: any[] = [],
    films: FilmNode[],
    edges: FilmEdge[]
): NavContext {
    const film = films[filmIndex];
    if (!film) {
        throw new Error(`Film with index ${filmIndex} not found`);
    }
    const shell = film.shell;

    let sibs: number[];
    if (siblings !== null) {
        sibs = siblings;
    } else {
        let baseSibs: number[];
        if (parent !== null) {
            baseSibs = neighbors(parent, [shell], films, edges);
        } else {
            // Find all films mapped directly to shell 0
            baseSibs = [];
            films.forEach((f, i) => {
                if (f.shell === 0) baseSibs.push(i);
            });
        }
        const lateral = neighbors(filmIndex, [shell], films, edges).filter(id => !baseSibs.includes(id));
        sibs = Array.from(new Set([...baseSibs, ...lateral]));
    }
    const idx = siblings !== null ? sibIdx : sibs.indexOf(filmIndex);

    const children = neighbors(filmIndex, null, films, edges).filter(id => films[id] && films[id].shell > shell);
    children.sort((a, b) => films[a].shell - films[b].shell);

    const visible = new Set([filmIndex]);
    if (parent !== null) visible.add(parent);
    sibs.forEach(s => visible.add(s));
    children.forEach(c => visible.add(c));
    connectedTo(filmIndex, edges).forEach(n => visible.add(n));

    return { current: filmIndex, parent, siblings: sibs, siblingIndex: idx, children, visible, stack };
}

```

## File: src/components/sphere.css
```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Fragment+Mono:ital@0;1&display=swap');

*,
*::before,
*::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0
}

:root {
    --ember: rgb(120, 39, 46);
    --ember-dim: rgba(120, 39, 46, 0.3);
    --gold: rgb(181, 140, 42);
    --gold-dim: rgba(181, 140, 42, 0.3);
    --cold: rgb(59, 139, 158);
    --cold-dim: rgba(59, 139, 158, 0.3);
    --bg: rgb(248, 248, 238);
    --surface: rgba(252, 252, 246, 0.92);
    --text: rgb(22, 10, 12);
    --dim: rgba(22, 10, 12, 0.5);
}

body.dragging {
    cursor: grabbing !important
}

/* Main layout container support for scrolling */
.main-sphere-wrapper {
  background: var(--bg);
  min-height: 100vh;
  position: relative;
  z-index: 0;
  overflow: hidden;
}

#c {
  position: absolute;
  inset: 0;
  z-index: 0;
  display: block;
}

#labels {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 5;
}

.node-label {
    position: absolute;
    transform: translate(-50%, -50%);
    pointer-events: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    transition: opacity .2s ease
}

.label-title {
    font-family: 'Fragment Mono', monospace;
    font-size: 9px;
    letter-spacing: .1em;
    text-transform: uppercase;
    padding: 2px 7px;
    white-space: nowrap;
    line-height: 1.2;
    transition: all .2s
}

.label-pillar .label-title {
    color: var(--text);
    font-weight: 600;
    background: rgba(252, 252, 246, 0.6);
    border: 1px solid rgba(120, 39, 46, .4)
}

.label-primary .label-title {
    color: var(--text);
    font-weight: 600;
    background: rgba(252, 252, 246, 0.6);
    border: 1px solid rgba(181, 140, 42, .35)
}

.label-secondary .label-title {
    color: var(--text);
    font-weight: 600;
    background: rgba(252, 252, 246, 0.6);
    border: 1px solid rgba(59, 139, 158, .3)
}

.label-title.active {
    padding: 3px 9px;
    font-size: 10px
}

.label-pillar .label-title.active {
    color: var(--text);
    font-weight: 700;
    background: rgba(252, 252, 246, 0.95);
    border-color: var(--ember)
}

.label-primary .label-title.active {
    color: var(--text);
    font-weight: 700;
    background: rgba(252, 252, 246, 0.95);
    border-color: var(--gold)
}

.label-secondary .label-title.active {
    color: var(--text);
    font-weight: 700;
    background: rgba(252, 252, 246, 0.95);
    border-color: var(--cold)
}

/* Header */
/* Sphere Header (Fixed Hero) */
.sphere-header {
  position: absolute;
  top: 0; left: 0; right: 0;
  padding: 32px 40px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  pointer-events: none;
  z-index: 100;
}

.sh-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sh-logo {
  font-family: 'Cormorant Garamond', serif;
  font-size: 28px;
  font-weight: 300;
  color: var(--text);
  letter-spacing: -0.01em;
}

.sh-logo em {
  font-style: italic;
  color: var(--gold);
}

.sh-hint {
  font-family: 'Fragment Mono', monospace;
  font-size: 10px;
  text-transform: uppercase;
  color: var(--gold);
  letter-spacing: 0.25em;
  opacity: 0.8;
}

.hints {
  font-family: 'Fragment Mono', monospace;
  font-size: 10px;
  text-align: right;
  line-height: 1.8;
  color: var(--text);
  letter-spacing: 0.05em;
  opacity: 0.6;
}

/* Shell legend */
.shells-legend {
    position: absolute;
    bottom: 28px;
    left: 28px;
    z-index: 10;
    pointer-events: none;
    display: flex;
    flex-direction: column;
    gap: 9px
}

.shell-item {
    display: flex;
    align-items: center;
    gap: 9px;
    font-family: 'Fragment Mono', monospace;
    font-size: 9px;
    color: rgba(22, 10, 12, 0.95);
    letter-spacing: .08em
}

.shell-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0
}

/* ─── NAVIGATION CONTROLS ─── */
#nav-controls {
    position: absolute;
    left: 50%;
    bottom: 32px;
    transform: translateX(-50%);
    z-index: 20;
    pointer-events: auto;
    display: none;
    flex-direction: column;
    align-items: center;
    gap: 6px;
}

#nav-controls.visible {
    display: none !important;
}

.nav-row {
    display: flex;
    gap: 6px
}

.nav-btn {
    width: 40px;
    height: 40px;
    border-radius: 2px;
    border: 1px solid rgba(181, 140, 42, .3);
    background: rgba(252, 252, 246, .9);
    backdrop-filter: blur(12px);
    color: var(--gold);
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all .18s ease;
    font-family: 'Fragment Mono', monospace;
    flex-shrink: 0;
}

.nav-btn:hover:not(:disabled) {
    background: rgba(181, 140, 42, .15);
    border-color: var(--gold);
    color: var(--text)
}

.nav-btn:disabled {
    opacity: .18;
    cursor: default;
    border-color: rgba(181, 140, 42, .1)
}

.nav-label {
    font-family: 'Fragment Mono', monospace;
    font-size: 8px;
    letter-spacing: .2em;
    color: rgba(181, 140, 42, .4);
    text-transform: uppercase;
    text-align: center
}

.nav-counter {
    font-family: 'Fragment Mono', monospace;
    font-size: 8px;
    letter-spacing: .1em;
    color: rgba(181, 140, 42, .5);
    text-align: center;
    margin-top: 2px
}

/* ─── INFO PANEL ─── */
#panel {
    position: absolute;
    right: 28px;
    bottom: 28px;
    z-index: 10;
    width: 320px;
    background: var(--surface);
    border: 1px solid rgba(181, 140, 42, .2);
    backdrop-filter: blur(20px);
    opacity: 0;
    transform: translateY(12px) scale(.97);
    transition: opacity .3s ease, transform .3s ease;
    pointer-events: none;
}

#panel.visible {
    opacity: 1;
    transform: none;
    pointer-events: auto
}

#panel-close {
    position: absolute;
    top: 12px;
    right: 14px;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--dim);
    font-size: 15px;
    font-family: 'Fragment Mono', monospace;
    transition: color .2s;
    z-index: 1
}

#panel-close:hover {
    color: var(--gold)
}

/* Poster */
#panel-poster {
    width: 100%;
    height: 160px;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: flex-end;
}

.poster-bg {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center
}

.poster-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(252, 252, 246, 1) 0%, rgba(252, 252, 246, .2) 60%, transparent 100%)
}

.poster-content {
    position: relative;
    z-index: 1;
    padding: 16px 18px 14px
}

.poster-eyebrow {
    font-family: 'Fragment Mono', monospace;
    font-size: 8px;
    letter-spacing: .3em;
    text-transform: uppercase;
    opacity: .5;
    margin-bottom: 3px
}

.poster-film-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 400;
    color: var(--text);
    line-height: 1.1;
    margin-bottom: 2px
}

.poster-film-meta {
    font-family: 'Fragment Mono', monospace;
    font-size: 9px;
    color: rgba(22, 10, 12, .6);
    letter-spacing: .08em
}

/* Panel body */
.panel-body {
    padding: 14px 18px 18px
}

.p-badge {
    display: inline-block;
    margin-bottom: 10px;
    font-family: 'Fragment Mono', monospace;
    font-size: 8px;
    letter-spacing: .2em;
    text-transform: uppercase;
    padding: 2px 8px
}

.p-badge-pillar {
    background: rgba(120, 39, 46, .12);
    border: 1px solid rgba(120, 39, 46, .35);
    color: var(--ember)
}

.p-badge-primary {
    background: rgba(181, 140, 42, .1);
    border: 1px solid rgba(181, 140, 42, .3);
    color: var(--gold)
}

.p-badge-secondary {
    background: rgba(59, 139, 158, .06);
    border: 1px solid rgba(59, 139, 158, .2);
    color: var(--cold)
}

.p-section {
    font-family: 'Fragment Mono', monospace;
    font-size: 8px;
    letter-spacing: .2em;
    color: rgba(22, 10, 12, .4);
    text-transform: uppercase;
    margin-bottom: 6px
}

.p-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-bottom: 14px
}

.p-tag {
    font-family: 'Fragment Mono', monospace;
    font-size: 8px;
    letter-spacing: .08em;
    padding: 2px 7px;
    border: 1px solid rgba(181, 140, 42, .18);
    color: var(--gold);
    background: rgba(181, 140, 42, .05)
}

.p-conns {
    display: flex;
    flex-direction: column;
    gap: 5px
}

.p-conn {
    font-family: 'Fragment Mono', monospace;
    font-size: 9px;
    color: rgba(22, 10, 12, .7);
    letter-spacing: .05em;
    display: flex;
    align-items: center;
    gap: 7px;
    line-height: 1.3
}

.p-conn-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    flex-shrink: 0
}

.p-conn-type {
    font-size: 8px;
    opacity: .4;
    font-style: italic;
    white-space: nowrap
}

/* Path breadcrumb */
#breadcrumb {
    position: absolute;
    top: 90px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    pointer-events: none;
    display: none;
    align-items: center;
    gap: 6px;
    font-family: 'Fragment Mono', monospace;
    font-size: 9px;
    letter-spacing: .1em;
    color: var(--dim);
}

#breadcrumb.visible {
    display: flex
}

.bc-item {
    color: var(--gold);
    opacity: .7
}

.bc-sep {
    opacity: .3
}

.bc-current {
    color: var(--text);
    opacity: .9
}

/* ─── MOBILE RESPONSIVENESS ─── */
@media (max-width: 768px) {
    .sphere-header {
        padding: 20px;
        flex-direction: column;
        gap: 8px;
    }
    .sh-logo {
        font-size: 22px;
    }
    .hints {
        display: none; /* Hide hints to avoid overlap */
    }
    .sh-hint {
        font-size: 8px;
    }

    /* Adjust info panel to be a bottom sheet-like layout */
    #panel {
        right: 10px;
        left: 10px;
        bottom: 10px;
        width: calc(100% - 20px);
        max-height: 50vh;
        overflow-y: auto;
    }
    
    #panel-poster {
        height: 120px;
    }

    .node-label .label-title {
        font-size: 8px;
        padding: 1px 5px;
    }
    
    .label-title.active {
        font-size: 9px;
    }

    /* Shell legend adjustment */
    .shells-legend {
        bottom: 80px; /* Move up to not overlap with bottom UI */
        left: 20px;
        transform: scale(0.9);
        transform-origin: bottom left;
    }

    .shell-navigator-container {
        left: 15px !important;
        gap: 8px !important;
    }
}
```

## File: src/app/sphere/page.tsx
```tsx
import { getPersonalizedGraph } from "@/app/actions/graph";
import SemanticSphere from "@/components/SemanticSphere";
import EditorialSection from "@/components/home/EditorialSection";
import NowShowingCarousel from "@/components/home/NowShowingCarousel";
import Footer from "@/components/layout/Footer";

export default async function Home() {
  const { nodes, edges } = await getPersonalizedGraph();

  if (!nodes || nodes.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8f8ee] text-[#78272e]">
        <div className="text-center p-8 border border-[#78272e]/20 rounded-lg max-w-md">
          <h2 className="text-2xl font-bold mb-4">Sfera in preparazione...</h2>
          <p className="mb-6 opacity-80">
            Sembra che tu non abbia ancora completato l&apos;onboarding o che il sistema stia ancora elaborando i tuoi gusti.
          </p>
          <a
            href="/onboarding"
            className="px-6 py-2 bg-[#78272e] text-white rounded-full hover:bg-[#78272e]/90 transition-colors"
          >
            Configura i tuoi Pilastri
          </a>
        </div>
      </div>
    );
  }

  // Capped edges as fallback if DB edges are too sparse or for consistency
  const cappedEdges = edges.slice(0, 150);

  // 3. CAROUSEL MOVIES (Most recent ones from our personalized set)
  const carouselMovies = [...nodes]
    .sort((a, b) => b.year - a.year) // sort by newest
    .slice(0, 15) // take top 15
    .map(n => ({
      id: n.id,
      title: n.title,
      director: n.dir,
      year: n.year,
      themes: n.tags.slice(0, 3), // max 3 tags for UI constraints
      poster: n.poster_url || undefined
    }));

  return (
    <main className="w-full min-h-screen m-0 p-0 relative">
      <section className="relative w-full h-[100vh] overflow-hidden">
        <SemanticSphere files={nodes} edges={cappedEdges} />
      </section>
      <EditorialSection />
      <NowShowingCarousel movies={carouselMovies} />
      <Footer />
    </main>
  );
}

```

## File: docs/approccio.md
```md
# Report Tecnico-Strategico: Popolamento della Sfera Semantica

Il presente documento illustra le metodologie per il popolamento dei livelli di navigazione (Shell) all'interno dell'applicazione NoZapp. L'obiettivo è definire la logica di transizione dai "Pilastri" dell'utente verso la scoperta di nuovi contenuti cinematografici.

---

## Componenti Fondamentali della Rete

Per comprendere le strategie di suggerimento, è necessario definire i componenti che costituiscono l'architettura dei dati.

### 1. Pilastri (Shell 0)
Rappresentano i film selezionati dall'utente durante la fase di onboarding. Costituiscono il punto di origine (Shell 0) per la generazione della sfera personalizzata.

### 2. Collegamenti Editoriali (Editorial Edges)
Questi elementi rappresentano connessioni manuali e curate inserite direttamente nel database.
- **Definizione**: Un record che stabilisce una relazione semantica tra un Film A e un Film B.
- **Struttura**: Ogni collegamento è corredato da una categoria (tematica, stilistica, contrasto) e da una nota testuale che motiva la connessione.
- **Funzione**: Trasferire la competenza critica del team editoriale all'interno dell'algoritmo di navigazione.

### 3. Sistema di Pesi
Ogni collegamento editoriale è associato a un valore numerico (peso) compreso tra 0.1 e 1.0.
- **Significato**: Il peso indica la forza della correlazione tra i due titoli.
- **Impatto Visivo**: Un peso elevato (es. 0.9) determina una maggiore prossimità spaziale e una dimensione superiore del nodo nella visualizzazione 3D, indicando una raccomandazione forte. Un peso ridotto indica una correlazione suggerita ma meno diretta.

### 4. Metadati (Tag e Generi)
Informazioni strutturate (regista, anno, generi, temi) utilizzate dal sistema per identificare affinità in assenza di collegamenti manuali.

---

## Analisi degli Approcci di Scoperta

### Approccio 1: Curatela Editoriale Pura
Il sistema visualizza esclusivamente i collegamenti definiti manualmente nella tabella degli archi editoriali.
- **Logica**: Se un utente seleziona un film pilastro, la sfera mostrerà solo i titoli che il team editoriale ha collegato esplicitamente ad esso.
- **Applicazione**: Ideale per garantire la massima autorevolezza e precisione dei suggerimenti. Richiede un database di collegamenti ampio per evitare che la sfera risulti vuota per alcuni utenti.

### Approccio 2: Sistema Ibrido (Consigliato)
Integrazione tra collegamenti manuali e automazione basata sui metadati.
- **Logica**: Il sistema interroga prioritariamente i collegamenti editoriali. In caso di insufficienza di dati (sfera troppo sparsa), interviene un algoritmo di fallback che identifica titoli simili tramite temi e generi comuni.
- **Applicazione**: Assicura un'esperienza utente sempre ricca e funzionale fin dal primo accesso, permettendo al contempo di valorizzare le connessioni manuali ovunque presenti.

### Approccio 3: Discovery e Varietà (Serendipity)
Iniezione di contenuti diversificati nel livello più esterno della sfera (Shell 2).
- **Logica**: Una frazione dei nodi visualizzati non deriva da legami diretti con i pilastri, ma da una selezione di titoli di alta qualità o di rilievo storico presenti nel database.
- **Applicazione**: Utile per espandere gli orizzonti dell'utente e prevenire la saturazione dei suggerimenti verso un unico genere o filone.

### Approccio 4: Analisi Semantica Vettoriale
Utilizzo di modelli di intelligenza artificiale per il calcolo della distanza semantica tra i film.
- **Logica**: Confronto delle descrizioni e delle sinossi per trovare affinità di "atmosfera" o "stile narrativo" che prescindono dai tag tradizionali.
- **Applicazione**: Soluzione avanzata per scalare la scoperta su migliaia di titoli in modo automatizzato, mantenendo un alto livello di pertinenza.

---

## Considerazioni sulla Propagazione
È importante sottolineare che ogni collegamento editoriale inserito nel sistema è **globale**. Un ponte creato tra due titoli non è limitato a un singolo utente, ma arricchisce l'intera mappa cinematografica del progetto. La personalizzazione avviene alla base: ogni utente esplorerà la mappa partendo dai propri pilastri, visualizzando i nodi e le shell corrispondenti alla propria posizione nella rete.

## Raccomandazione Strategica
Si consiglia l'adozione dell'**Approccio 2 (Ibrido)**. Questa soluzione garantisce la continuità dell'esperienza d'uso (sfera sempre popolata) e permette al team editoriale di concentrarsi sulla creazione di connessioni di alto valore, che il sistema riconoscerà e premierà automaticamente rispetto ai legami generati dai metadati.

```

