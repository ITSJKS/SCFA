def firstOccurrence(nums):
    # print(nums)
    l=0
    r=len(nums)-1
    ans=0
    while(l<=r):
        mid=(l+r)//2
        if nums[mid]==1:
            r=mid-1
            ans=mid
            # return mid
        if nums[mid]==2:
            l=mid+1
        else:
            r=mid-1
    if nums[ans]==1:
        return ans
    else:
        return -1