def isPresent(n, nums, target):
    def bs(nums,target):
        l=0
        r=len(nums)-1
        while l<=r:
            m=(l+r)//2
            if nums[m]==target:
                return m
            elif nums[m]>target:
                l=m+1
            else:
                r=m-1
        return -1
    return bs(nums,target)