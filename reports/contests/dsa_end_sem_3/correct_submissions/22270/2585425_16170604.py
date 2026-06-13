def isPresent(n, x, t):
    l=0
    r=n-1
    while l<=r:
        m=(l+r)//2
        if x[m]==t:
            return m
        elif x[m]>t:
            l=m+1
        else:
            r=m-1
    return -1