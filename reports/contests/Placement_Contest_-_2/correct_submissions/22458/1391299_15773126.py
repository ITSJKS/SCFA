def FindSqrt(x):

    if x==0 or x==1:
        return x
    
    l = 2
    r = x

    def condition(mid):
        return mid*mid>x

    while l < r:
        mid = (l+ r)// 2

        if condition(mid):
            r=mid
        else:
            l=mid+1

    return l-1