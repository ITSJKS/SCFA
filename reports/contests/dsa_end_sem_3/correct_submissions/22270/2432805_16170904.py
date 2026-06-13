def isPresent(n, nums, target):
    #write your code here
    l=0
    r=n-1
    mid=(l+r)//2
    while l<=r:
        mid=(l+r)//2
        if nums[mid]>target:
            l=mid+1
        elif nums[mid]<target:
            r=mid-1
        else:
            return mid
    return -1