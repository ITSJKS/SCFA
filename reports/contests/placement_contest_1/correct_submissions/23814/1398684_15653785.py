def firstOccurrence(nums):
    l=0
    r=len(nums)
    ans=-1
    while l<r:
        mid=(l+r)//2
        if nums[mid]==1:
            ans=mid
            r=mid
        elif nums[mid]>1:
            l=mid+1
        else:
            r=mid-1
    return ans