def firstOccurrence(nums):

    n=len(nums)
    l=0
    r=n-1

    # flag=False

    def condition(mid):
        return arr[mid]<=1


    while(l<r):
        mid=(l+r)//2

        if(condition(mid)):
            r=mid
        else:
            l=mid+1


    # if not flag:
    #     return -1

    # if(l==n-1 and arr[l]==1):
    #     return l
    # else:
    #     return -1

    # print(l)
    # print(r)

    # return l if l!=r else -1


    return l if arr[l]==1 else -1