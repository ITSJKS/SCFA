def nextGreatestLetter(x, t):
    t=ord(t)
    m=200
    l=0
    r=len(x)-1
    while l<=r:
        mid=(l+r)//2
        if ord(x[mid])>t:
            m=min(m,ord(x[mid]))
            r=mid-1
        else:
            l=mid+1
    if m!=200:
        return (chr(m))
    return x[0]