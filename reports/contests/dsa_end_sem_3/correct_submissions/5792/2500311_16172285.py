def nextGreatestLetter(letters, target):
    l = letters
    t = target
    s = 0
    e = len(l)-1
    while s<=e:
        m = (s+e)//2
        if l[m]>t:e=m-1
        else: s=m+1
    if e+1 == len(l): return l[0]
    return l[e+1]