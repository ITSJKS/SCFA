def trap(arr):
    n = len(arr)
    prefl = []
    suffl = []
    pref = 0
    suff = 0
    for i in range(n):
        pref = max(arr[i],pref)
        suff = max(arr[n-i-1], suff)
        prefl.append(pref)
        suffl.append(suff)
    store = 0
    suffl = suffl[::-1]

    for i in range(n):
        store += abs(min(prefl[i], suffl[i]) - arr[i])
    return(store)